import { PayoutRequest } from '@/domain/entities/payoutRequest';
import { PayoutRequestStatus } from '@/domain/enums/PayoutRequestEnums';
import { WalletTransactionStatus, WalletTransactionType } from '@/domain/enums/WalletEnums';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPayoutRequestRepository } from '@/domain/repositoryInterface/IPayoutRequestRepository';
import { ITransactionManager } from '@/domain/repositoryInterface/ITransactionManager';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { payoutMessages } from '@/shared/constants/messages/payoutMessages';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IApprovePayoutRequest } from '@/useCases/interfaces/payout/IApprovePayoutRequest';
import { ClientSession } from 'mongoose';

export class ApprovePayoutRequestUseCase implements IApprovePayoutRequest {
    private _payoutRequestRepository: IPayoutRequestRepository;
    private _walletRepository: IWalletRepository;
    private _transactionManager: ITransactionManager<ClientSession>;
    private _consultationRepository: IConsultationRepository;

    constructor(
        payoutRequestRepository: IPayoutRequestRepository,
        walletRepository: IWalletRepository,
        transactionManager: ITransactionManager<ClientSession>,
        consultationRepository: IConsultationRepository,
    ) {
        this._payoutRequestRepository = payoutRequestRepository;
        this._walletRepository = walletRepository;
        this._transactionManager = transactionManager;
        this._consultationRepository = consultationRepository;
    }

    async execute(payoutRequestId: string): Promise<PayoutRequest | null> {
        return this._transactionManager.runInTransaction(async session => {
            const payout = await this._payoutRequestRepository.findById(payoutRequestId);
            if (!payout) throw new AppError(payoutMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
            if (payout.status !== PayoutRequestStatus.PENDING)
                throw new AppError(payoutMessages.ERROR.NOT_PENDING, HttpStatus.BAD_REQUEST);

            const consultations = await this._consultationRepository.findByIds(payout.consultationIds);

            if (!consultations || consultations.length === 0)
                throw new AppError(payoutMessages.ERROR.NO_ELIGIBLE_CONSULTATIONS, HttpStatus.BAD_REQUEST);

            const alreadyIncluded = consultations.some(c => c.includedInPayout);
            if (alreadyIncluded)
                throw new AppError(
                    payoutMessages.ERROR.CONSULTATION_ALREADY_INCLUDED_IN_PAYOUT,
                    HttpStatus.BAD_REQUEST,
                );

            await this._consultationRepository.markIncludedInPayout(payout.consultationIds, session);

            const psychologistWallet = await this._walletRepository.findByUserId(payout.psychologistId);
            if (!psychologistWallet)
                throw new AppError(walletMessages.ERROR.PSYCHOLOGIST_WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);

            await this._walletRepository.createTransaction(
                {
                    walletId: psychologistWallet.id,
                    amount: payout.payoutAmount,
                    type: WalletTransactionType.CREDIT,
                    status: WalletTransactionStatus.COMPLETED,
                    reference: payoutRequestId,
                    metadata: {
                        type: 'payout',
                        psychologistId: payout.psychologistId,
                    },
                },
                session,
            );

            await this._walletRepository.updateBalance(psychologistWallet.id, payout.payoutAmount, session);

            await this._payoutRequestRepository.updateStatus(
                payoutRequestId,
                PayoutRequestStatus.APPROVED,
                new Date(),
                session,
            );

            return this._payoutRequestRepository.findById(payoutRequestId);
        });
    }
}
