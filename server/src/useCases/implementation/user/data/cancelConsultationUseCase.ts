import { ICancelConsultationUseCase } from '@/useCases/interfaces/user/data/ICancelConsultationUseCase';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { Consultation } from '@/domain/entities/consultation';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { AppError } from '@/domain/errors/AppError';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { ConsultationPaymentStatus, ConsultationStatus } from '@/domain/enums/ConsultationEnums';

export class CancelConsultationUseCase implements ICancelConsultationUseCase {
    private _walletRepo: IWalletRepository;
    private _consultationRepo: IConsultationRepository;
    private _paymentRepo: IPaymentRepository;
    private _slotRepo: ISlotRepository;

    constructor(
        walletRepo: IWalletRepository,
        consultationRepo: IConsultationRepository,
        paymentRepo: IPaymentRepository,
        slotRepo: ISlotRepository,
    ) {
        this._walletRepo = walletRepo;
        this._consultationRepo = consultationRepo;
        this._paymentRepo = paymentRepo;
        this._slotRepo = slotRepo;
    }

    async execute(
        userId: string,
        consultationId: string,
        reason: string,
    ): Promise<Consultation> {
        const consultation =
            await this._consultationRepo.findById(consultationId);
        if (!consultation) {
            throw new AppError(
                bookingMessages.ERROR.CONSULTATION_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        }

        if (consultation.patientId !== userId) {
            throw new AppError(
                authMessages.ERROR.UNAUTHORIZED,
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (consultation.status !== ConsultationStatus.BOOKED) {
            throw new AppError(
                bookingMessages.ERROR.ONLY_BOOKED_CANCEL,
                HttpStatus.BAD_REQUEST,
            );
        }

        if (consultation.paymentStatus === ConsultationPaymentStatus.PAID) {
            const wallet = await this._walletRepo.findByUserId(userId);

            if (!wallet) {
                throw new AppError(
                    walletMessages.ERROR.NOT_FOUND,
                    HttpStatus.NOT_FOUND,
                );
            }

            const payment = await this._paymentRepo.findByConsultationId(
                consultation.id,
            );
            if (!payment) {
                throw new AppError(
                    bookingMessages.ERROR.PAYMENT_NOT_FOUND,
                    HttpStatus.NOT_FOUND,
                );
            }

            await this._walletRepo.refundToWallet(
                wallet.id,
                payment.amount,
                `refund_consultation_${consultation.id}`,
            );
        }

        consultation.status = ConsultationStatus.CANCELLED;
        consultation.cancellationReason = reason;
        consultation.cancelledAt = new Date();

        const updatedConsultation =
            await this._consultationRepo.update(consultation);

        if (!updatedConsultation) {
            throw new AppError(
                generalMessages.ERROR.INTERNAL_SERVER_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        if (updatedConsultation.slotId) {
            await this._slotRepo.markSlotAsAvailable(
                updatedConsultation.slotId,
            );
        }

        return updatedConsultation;
    }
}
