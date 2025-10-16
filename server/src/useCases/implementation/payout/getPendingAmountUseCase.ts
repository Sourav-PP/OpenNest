import { PayoutRequestStatus } from '@/domain/enums/PayoutRequestEnums';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IPayoutRequestRepository } from '@/domain/repositoryInterface/IPayoutRequestRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { appConfig } from '@/infrastructure/config/config';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPendingAmountUseCase } from '@/useCases/interfaces/payout/IGetPendingAmountUseCase';

export class GetPendingAmountUseCase implements IGetPendingAmountUseCase {
    private _consultationRepository: IConsultationRepository;
    private _paymentRepository: IPaymentRepository;
    private _psychologistRepository: IPsychologistRepository;
    private _payoutRequestRepository: IPayoutRequestRepository;

    constructor(
        consultationRepository: IConsultationRepository,
        paymentRepository: IPaymentRepository,
        psychologistRepository: IPsychologistRepository,
        payoutRequestRepository: IPayoutRequestRepository,
    ) {
        this._consultationRepository = consultationRepository;
        this._paymentRepository = paymentRepository;
        this._psychologistRepository = psychologistRepository;
        this._payoutRequestRepository = payoutRequestRepository;
    }

    async execute(psychologistId: string): Promise<{
        totalAmount: number;
        commissionAmount: number;
        payoutAmount: number;
        consultationCount: number;
        consultationIds: string[];
    }> {
        const psychologist =
            await this._psychologistRepository.findByUserId(psychologistId);
        if (!psychologist)
            throw new AppError(
                psychologistMessages.ERROR.NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );

        const pendingRequests =
            await this._payoutRequestRepository.findByPsychologistId(
                psychologist.userId,
            );
        const pendingConsultationIds = pendingRequests
            .filter(request => request.status === PayoutRequestStatus.PENDING)
            .flatMap(r => r.consultationIds);

        const consultations =
            await this._consultationRepository.findUnpaidCompletedConsultationsByPsychologistId(
                psychologist.id,
            );

        const eligibleConsultations = consultations.filter(
            c => !pendingConsultationIds.includes(c.id),
        );
        if (eligibleConsultations.length === 0) {
            return {
                totalAmount: 0,
                commissionAmount: 0,
                payoutAmount: 0,
                consultationCount: 0,
                consultationIds: [],
            };
        }

        const payments = await this._paymentRepository.findByConsultationIds(
            eligibleConsultations.map(c => c.id),
        );

        if (payments.length === 0) {
            return {
                totalAmount: 0,
                commissionAmount: 0,
                payoutAmount: 0,
                consultationCount: 0,
                consultationIds: [],
            };
        }

        const totalAmount = payments.reduce(
            (sum, payment) => sum + payment.amount,
            0,
        );

        const commissionAmount = Math.round(
            (totalAmount * appConfig.stripe.commissionPercentage) / 100,
        );

        const payoutAmount = totalAmount - commissionAmount;

        return {
            totalAmount,
            commissionAmount,
            payoutAmount,
            consultationCount: consultations.length,
            consultationIds: consultations.map(c => c.id),
        };
    }
}
