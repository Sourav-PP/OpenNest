import { IPsychologistCancelConsultationUseCase } from '@/useCases/interfaces/psychologist/data/IPsychologistCancelConsultationUseCase';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { ConsultationRepository } from '@/infrastructure/repositories/user/consultationRepository';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { Consultation } from '@/domain/entities/consultation';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { ConsultationPaymentStatus, ConsultationStatus } from '@/domain/enums/ConsultationEnums';

export class PsychologistCancelConsultationUseCase implements IPsychologistCancelConsultationUseCase {
    private _walletRepo: IWalletRepository;
    private _consultationRepo: ConsultationRepository;
    private _paymentRepo: IPaymentRepository;
    private _slotRepo: ISlotRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(
        walletRepo: IWalletRepository,
        consultationRepo: ConsultationRepository,
        paymentRepo: IPaymentRepository,
        slotRepo: ISlotRepository,
        psychologistRepo: IPsychologistRepository,
    ) {
        this._walletRepo = walletRepo;
        this._consultationRepo = consultationRepo;
        this._paymentRepo = paymentRepo;
        this._slotRepo = slotRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(userId: string, consultationId: string, reason: string): Promise<Consultation> {
        const psychologist = await this._psychologistRepo.findByUserId(userId);

        if (!psychologist) {
            throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const psychologistId = psychologist.id;

        const consultation = await this._consultationRepo.findById(consultationId);
        if (!consultation) {
            throw new AppError(bookingMessages.ERROR.CONSULTATION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (consultation.psychologistId !== psychologistId) {
            throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        if (consultation.status !== ConsultationStatus.BOOKED) {
            throw new AppError(bookingMessages.ERROR.ONLY_BOOKED_CANCEL, HttpStatus.BAD_REQUEST);
        }

        if (consultation.paymentStatus === ConsultationPaymentStatus.PAID) {
            const wallet = await this._walletRepo.findByUserId(consultation.patientId);

            if (!wallet) {
                throw new AppError(walletMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const payment = await this._paymentRepo.findByConsultationId(consultation.id);
            if (!payment) {
                throw new AppError(bookingMessages.ERROR.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            await this._walletRepo.refundToWallet(wallet.id, payment.amount, `refund_consultation_${consultation.id}`);
        }

        consultation.status = ConsultationStatus.CANCELLED;
        consultation.cancellationReason = reason;
        consultation.cancelledAt = new Date();

        const updatedConsultation = await this._consultationRepo.update(consultation);

        if (!updatedConsultation) {
            throw new AppError(generalMessages.ERROR.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (consultation.slotId) {
            await this._slotRepo.markSlotAsNotAvailable(consultation.slotId);
        }

        return updatedConsultation;
    }
}
