import { PayoutRequest } from '@/domain/entities/payoutRequest';
import { PayoutRequestStatus } from '@/domain/enums/PayoutRequestEnums';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IPayoutRequestRepository } from '@/domain/repositoryInterface/IPayoutRequestRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { appConfig } from '@/infrastructure/config/config';
import { payoutMessages } from '@/shared/constants/messages/payoutMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IRequestPayoutUseCase } from '@/useCases/interfaces/payout/IRequestPayoutUseCase';

export class RequestPayoutUseCase implements IRequestPayoutUseCase {
    private _consultationRepository: IConsultationRepository;
    private _payoutRequestRepository: IPayoutRequestRepository;
    private _paymentRepository: IPaymentRepository;
    private _psychologistRepository: IPsychologistRepository;

    constructor(
        consultationRepository: IConsultationRepository,
        payoutRequestRepository: IPayoutRequestRepository,
        paymentRepository: IPaymentRepository,
        psychologistRepository: IPsychologistRepository,
    ) {
        this._consultationRepository = consultationRepository;
        this._payoutRequestRepository = payoutRequestRepository;
        this._paymentRepository = paymentRepository;
        this._psychologistRepository = psychologistRepository;
    }

    async execute(psychologistId: string): Promise<PayoutRequest> {
        const psychologist = await this._psychologistRepository.findByUserId(psychologistId);
        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        const consultations = await this._consultationRepository.findUnpaidCompletedConsultationsByPsychologistId(
            psychologist.id,
        );
        if (consultations.length === 0) {
            throw new Error(payoutMessages.ERROR.NO_ELIGIBLE_CONSULTATIONS);
        }

        const payments = await this._paymentRepository.findByConsultationIds(consultations.map(c => c.id));
        if (payments.length === 0) {
            throw new Error(payoutMessages.ERROR.NO_ELIGIBLE_CONSULTATIONS);
        }

        const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
        if (total <= 0) {
            throw new Error(payoutMessages.ERROR.INVALID_PAYOUT_AMOUNT);
        }
        const commissionAmount = Math.round((total * appConfig.stripe.commissionPercentage) / 100);
        const payoutAmount = total - commissionAmount;
        if (payoutAmount <= 0) {
            throw new Error(payoutMessages.ERROR.INVALID_PAYOUT_AMOUNT);
        }

        const payoutRequest = await this._payoutRequestRepository.create({
            psychologistId,
            consultationIds: consultations.map(c => c.id),
            requestedAmount: total,
            commissionAmount,
            payoutAmount,
            status: PayoutRequestStatus.PENDING,
        });

        return payoutRequest;
    }
}
