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
import {
    ConsultationPaymentMethod,
    ConsultationPaymentStatus,
    ConsultationStatus,
} from '@/domain/enums/ConsultationEnums';
import { ISubscriptionRepository } from '@/domain/repositoryInterface/ISubscriptionRepository';
import { INotificationService } from '@/domain/serviceInterface/INotificationService';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { notificationMessages } from '@/shared/constants/messages/notificationsMessages';
import { NotificationType } from '@/domain/enums/NotificationEnums';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { userMessages } from '@/shared/constants/messages/userMessages';

export class CancelConsultationUseCase implements ICancelConsultationUseCase {
    private _walletRepo: IWalletRepository;
    private _consultationRepo: IConsultationRepository;
    private _paymentRepo: IPaymentRepository;
    private _slotRepo: ISlotRepository;
    private _subscriptionRepo: ISubscriptionRepository;
    private _userRepo: IUserRepository;
    private _getNotificationService: () => INotificationService;

    constructor(
        walletRepo: IWalletRepository,
        consultationRepo: IConsultationRepository,
        paymentRepo: IPaymentRepository,
        slotRepo: ISlotRepository,
        subscriptionRepo: ISubscriptionRepository,
        userRepo: IUserRepository,
        getNotificationService: () => INotificationService,
    ) {
        this._walletRepo = walletRepo;
        this._consultationRepo = consultationRepo;
        this._paymentRepo = paymentRepo;
        this._slotRepo = slotRepo;
        this._subscriptionRepo = subscriptionRepo;
        this._userRepo = userRepo;
        this._getNotificationService = getNotificationService;
    }

    async execute(userId: string, consultationId: string, reason: string): Promise<Consultation> {
        const consultation = await this._consultationRepo.findById(consultationId);
        if (!consultation) {
            throw new AppError(bookingMessages.ERROR.CONSULTATION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (consultation.patientId !== userId) {
            throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const patient = await this._userRepo.findById(consultation.patientId);
        if (!patient) throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        if (consultation.status !== ConsultationStatus.BOOKED) {
            throw new AppError(bookingMessages.ERROR.ONLY_BOOKED_CANCEL, HttpStatus.BAD_REQUEST);
        }

        const notificationService = this._getNotificationService();

        if (consultation.paymentStatus === ConsultationPaymentStatus.PAID) {
            if (consultation.paymentMethod === ConsultationPaymentMethod.SUBSCRIPTION) {
                if (!consultation.subscriptionId) {
                    throw new AppError(SubscriptionMessages.ERROR.SUBSCRIPTION_NOT_FOUND, HttpStatus.NOT_FOUND);
                }
                await this._subscriptionRepo.incrementCredit(consultation.subscriptionId, 1);
            }
            const wallet = await this._walletRepo.findByUserId(userId);

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

        // free up slot
        if (updatedConsultation.slotId) {
            await this._slotRepo.markSlotAsAvailable(updatedConsultation.slotId);
        }

        // send notifications
        const userMessage =
            consultation.paymentMethod === ConsultationPaymentMethod.SUBSCRIPTION
                ? notificationMessages.SUCCESS.CANCELED_SUBSCRIPTION_CONSULTATION
                : notificationMessages.SUCCESS.CANCELED_CONSULTATION;

        await notificationService.send({
            recipientId: consultation.patientId,
            type: NotificationType.CONSULTATION_CANCELLED,
            message: userMessage,
            consultationId: consultation.id,
        });

        await notificationService.send({
            recipientId: consultation.psychologistId,
            message: notificationMessages.SUCCESS.CANCELED_CONSULTATION_PSYCHOLOGIST(patient.name, consultation.cancellationReason),
            type: NotificationType.CONSULTATION_CANCELLED,
            consultationId: consultation.id,
        });

        return updatedConsultation;
    }
}
