import { Consultation } from '@/domain/entities/consultation';
import { Subscription } from '@/domain/entities/subscription';
import {
    ConsultationPaymentMethod,
    ConsultationPaymentStatus,
    ConsultationStatus,
} from '@/domain/enums/ConsultationEnums';
import { NotificationType } from '@/domain/enums/NotificationEnums';
import { SubscriptionStatus } from '@/domain/enums/PlanEnums';
import { VideoCallStatus } from '@/domain/enums/VideoCallEnums';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { ISubscriptionRepository } from '@/domain/repositoryInterface/ISubscriptionRepository';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { IVideoCallService } from '@/domain/serviceInterface/IVideoCallService';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { notificationMessages } from '@/shared/constants/messages/notificationsMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreateNotificationUseCase } from '@/useCases/interfaces/notification/ICreateNotificationUseCase';
import { IBookConsultationWithSubscriptionUseCase } from '@/useCases/interfaces/subscription/IBookConsultationWithSubscriptionUseCase';

export class BookConsultationWithSubscriptionUseCase implements IBookConsultationWithSubscriptionUseCase {
    private _subscriptionRepository: ISubscriptionRepository;
    private _slotRepository: ISlotRepository;
    private _consultationRepository: IConsultationRepository;
    private _videoCallService: IVideoCallService;
    private _videoCallRepo: IVideoCallRepository;
    private _createNotificationUseCase: ICreateNotificationUseCase;
    private _psychologistRepo: IPsychologistRepository;
    private _paymentRepository: IPaymentRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        slotRepository: ISlotRepository,
        consultationRepository: IConsultationRepository,
        videoCallService: IVideoCallService,
        videoCallRepo: IVideoCallRepository,
        createNotificationUseCase: ICreateNotificationUseCase,
        psychologistRepo: IPsychologistRepository,
        paymentRepository: IPaymentRepository,
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._slotRepository = slotRepository;
        this._consultationRepository = consultationRepository;
        this._videoCallService = videoCallService;
        this._videoCallRepo = videoCallRepo;
        this._createNotificationUseCase = createNotificationUseCase;
        this._psychologistRepo = psychologistRepo;
        this._paymentRepository = paymentRepository;
    }

    async execute(
        userId: string,
        subscriptionId: string,
        slotId: string,
        sessionGoal: string,
    ): Promise<{ consultation: Consultation; subscription: Subscription }> {
        if (!userId) {
            throw new AppError(adminMessages.ERROR.USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        if (!subscriptionId) {
            throw new AppError(SubscriptionMessages.ERROR.SUBSCRIPTION_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }
        if (!slotId) {
            throw new AppError(bookingMessages.ERROR.SLOT_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }
        const subscription = await this._subscriptionRepository.findById(subscriptionId);
        if (!subscription) {
            throw new AppError(SubscriptionMessages.ERROR.SUBSCRIPTION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (subscription.userId !== userId) {
            throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        if (subscription.status !== SubscriptionStatus.ACTIVE) {
            throw new AppError(SubscriptionMessages.ERROR.SUBSCRIPTION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        const slot = await this._slotRepository.findById(slotId);
        if (!slot) {
            throw new AppError(bookingMessages.ERROR.SLOT_NOT_AVAILABLE, HttpStatus.NOT_FOUND);
        }
        if (slot.isBooked) {
            throw new AppError(bookingMessages.ERROR.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);
        }

        if (subscription.creditRemaining <= 0) {
            throw new AppError(SubscriptionMessages.ERROR.INSUFFICIENT_CREDITS, HttpStatus.BAD_REQUEST);
        }

        const consultation = await this._consultationRepository.create({
            patientId: userId,
            psychologistId: slot.psychologistId,
            subscriptionId: subscription.id,
            slotId: slot.id,
            startDateTime: slot.startDateTime,
            endDateTime: slot.endDateTime,
            sessionGoal,
            status: ConsultationStatus.BOOKED,
            paymentStatus: ConsultationPaymentStatus.PAID,
            paymentMethod: ConsultationPaymentMethod.SUBSCRIPTION,
            paymentIntentId: null,
            includedInPayout: false,
        });

        const meetingLink = await this._videoCallService.generateMeetingLink(consultation.id);
        await this._consultationRepository.updateConsultation(consultation.id, {
            meetingLink,
        });

        // Atomically decrement 1 credit and get updated subscription
        const updated = await this._subscriptionRepository.decrementCreditsAtomically(subscription.id, 1);
        if (!updated) {
            throw new AppError(SubscriptionMessages.ERROR.INSUFFICIENT_CREDITS, HttpStatus.BAD_REQUEST);
        }

        await this._videoCallRepo.create({
            consultationId: consultation.id,
            patientId: consultation.patientId,
            psychologistId: consultation.psychologistId,
            callUrl: meetingLink,
            status: VideoCallStatus.SCHEDULED,
            startedAt: null,
            endedAt: null,
        });

        // mark the slot as booked
        await this._slotRepository.markSlotAsBooked(slot.id, userId);

        const psychologist = await this._psychologistRepo.findById(consultation.psychologistId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const oneHourBefore = new Date(consultation.startDateTime.getTime() - 60 * 60 * 1000);

        // reminder notification for the patient
        await this._createNotificationUseCase.execute({
            recipientId: consultation.patientId,
            consultationId: consultation.id,
            type: NotificationType.CONSULTATION_REMINDER,
            message: notificationMessages.CONSULTATION.PATIENT_CONSULTATION_REMINDER,
            read: false,
            notifyAt: oneHourBefore,
            sent: false,
        });

        // reminder notification for the psychologist
        await this._createNotificationUseCase.execute({
            recipientId: psychologist.userId,
            consultationId: consultation.id,
            type: NotificationType.CONSULTATION_REMINDER,
            message: notificationMessages.CONSULTATION.PSYCHOLOGIST_CONSULTATION_REMINDER,
            read: false,
            notifyAt: oneHourBefore,
            sent: false,
        });

        return { consultation, subscription: updated };
    }
}
