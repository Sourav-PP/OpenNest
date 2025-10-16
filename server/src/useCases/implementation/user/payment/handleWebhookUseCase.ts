import { IHandleWebhookUseCase } from '@/useCases/interfaces/user/payment/IHandleWebhookUseCase';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IPaymentService } from '@/domain/serviceInterface/IPaymentService';
import { AppError } from '@/domain/errors/AppError';
import Stripe from 'stripe';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { IVideoCallService } from '@/domain/serviceInterface/IVideoCallService';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { ICreateNotificationUseCase } from '@/useCases/interfaces/notification/ICreateNotificationUseCase';
import { notificationMessages } from '@/shared/constants/messages/notificationsMessages';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { ISubscriptionRepository } from '@/domain/repositoryInterface/ISubscriptionRepository';
import { IPlanRepository } from '@/domain/repositoryInterface/IPlanRepository';
import { PaymentPurpose, PaymentStatus } from '@/domain/enums/PaymentEnums';
import {
    ConsultationPaymentMethod,
    ConsultationPaymentStatus,
    ConsultationStatus,
} from '@/domain/enums/ConsultationEnums';
import { VideoCallStatus } from '@/domain/enums/VideoCallEnums';
import { NotificationType } from '@/domain/enums/NotificationEnums';
import {
    WalletTransactionStatus,
    WalletTransactionType,
} from '@/domain/enums/WalletEnums';
import {
    PlanBillingPeriod,
    SubscriptionStatus,
} from '@/domain/enums/PlanEnums';

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    private _paymentRepo: IPaymentRepository;
    private _paymentService: IPaymentService;
    private _consultationRepo: IConsultationRepository;
    private _slotRepo: ISlotRepository;
    private _walletRepo: IWalletRepository;
    private _videoCallService: IVideoCallService;
    private _videoCallRepo: IVideoCallRepository;
    private _psychologistRepo: IPsychologistRepository;
    private _createNotificationUseCase: ICreateNotificationUseCase;
    private _subscriptionRepo: ISubscriptionRepository;
    private _planRepo: IPlanRepository;

    constructor(
        paymentRepo: IPaymentRepository,
        paymentService: IPaymentService,
        consultationRepo: IConsultationRepository,
        slotRepo: ISlotRepository,
        walletRepo: IWalletRepository,
        videoCallService: IVideoCallService,
        videoCallRepo: IVideoCallRepository,
        psychologistRepo: IPsychologistRepository,
        createNotificationUseCase: ICreateNotificationUseCase,
        subscriptionRepo: ISubscriptionRepository,
        planRepo: IPlanRepository,
    ) {
        this._paymentRepo = paymentRepo;
        this._paymentService = paymentService;
        this._consultationRepo = consultationRepo;
        this._slotRepo = slotRepo;
        this._walletRepo = walletRepo;
        this._videoCallService = videoCallService;
        this._videoCallRepo = videoCallRepo;
        this._psychologistRepo = psychologistRepo;
        this._createNotificationUseCase = createNotificationUseCase;
        this._subscriptionRepo = subscriptionRepo;
        this._planRepo = planRepo;
    }

    async execute(
        payload: Buffer,
        signature: string,
        endpointSecret: string,
    ): Promise<void> {
        console.log('webhook triggered!');
        const event = await this._paymentService.verifyWebhookSignature(
            payload,
            signature,
            endpointSecret,
        );

        switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;
            const meta = session.metadata || {};

            const payment =
                await this._paymentRepo.findBySessionId(sessionId);
            if (!payment) {
                throw new AppError(
                    bookingMessages.ERROR.PAYMENT_NOT_FOUND,
                    HttpStatus.NOT_FOUND,
                );
            }

            // handle consultation booking
            if (meta.purpose === PaymentPurpose.CONSULTATION) {
                if (
                    !meta.psychologistId ||
                    !meta.slotId ||
                    !meta.startDateTime ||
                    !meta.endDateTime
                ) {
                    throw new AppError(
                        bookingMessages.ERROR.MISSING_METADATA,
                        HttpStatus.BAD_REQUEST,
                    );
                }

                const slot = await this._slotRepo.findById(meta.slotId);

                if (!slot || slot.isBooked) {
                    throw new AppError(
                        bookingMessages.ERROR.SLOT_NOT_AVAILABLE,
                        HttpStatus.CONFLICT,
                    );
                }

                if (payment.consultationId) {
                    throw new AppError(
                        bookingMessages.ERROR.CONSULTATION_EXISTS,
                        HttpStatus.CONFLICT,
                    );
                }

                // create consultation
                const consultation = await this._consultationRepo.create({
                    patientId: payment.userId,
                    psychologistId: meta.psychologistId,
                    subscriptionId: meta.subscriptionId,
                    slotId: meta.slotId,
                    startDateTime: new Date(meta.startDateTime),
                    endDateTime: new Date(meta.endDateTime),
                    sessionGoal: meta.sessionGoal,
                    status: ConsultationStatus.BOOKED,
                    paymentStatus: ConsultationPaymentStatus.PAID,
                    paymentMethod: ConsultationPaymentMethod.STRIPE,
                    paymentIntentId:
                        (session.payment_intent as string) || null,
                    includedInPayout: false,
                });

                const meetingLink =
                    await this._videoCallService.generateMeetingLink(
                        consultation.id,
                    );
                consultation.meetingLink = meetingLink;
                await this._consultationRepo.updateConsultation(
                    consultation.id,
                    { meetingLink },
                );

                await this._videoCallRepo.create({
                    consultationId: consultation.id,
                    patientId: consultation.patientId,
                    psychologistId: consultation.psychologistId,
                    callUrl: meetingLink,
                    status: VideoCallStatus.SCHEDULED,
                    startedAt: null,
                    endedAt: null,
                });

                // update the payment status
                payment.paymentStatus = PaymentStatus.SUCCEEDED;
                payment.transactionId =
                    (session.payment_intent as string) ?? null;
                payment.consultationId = consultation.id;
                await this._paymentRepo.updateBySessionId(
                    sessionId,
                    payment,
                );

                await this._slotRepo.markSlotAsBooked(
                    meta.slotId,
                    payment.userId,
                );

                const psychologist = await this._psychologistRepo.findById(
                    consultation.psychologistId,
                );
                if (!psychologist) {
                    throw new AppError(
                        psychologistMessages.ERROR.NOT_FOUND,
                        HttpStatus.NOT_FOUND,
                    );
                }

                const oneHourBefore = new Date(
                    consultation.startDateTime.getTime() - 60 * 60 * 1000,
                );

                // reminder notification for the patient
                await this._createNotificationUseCase.execute({
                    recipientId: consultation.patientId,
                    consultationId: consultation.id,
                    type: NotificationType.CONSULTATION_REMINDER,
                    message:
                        notificationMessages.CONSULTATION
                            .PATIENT_CONSULTATION_REMINDER,
                    read: false,
                    notifyAt: oneHourBefore,
                    sent: false,
                });

                // reminder notification for the psychologist
                await this._createNotificationUseCase.execute({
                    recipientId: psychologist.userId,
                    consultationId: consultation.id,
                    type: NotificationType.CONSULTATION_REMINDER,
                    message:
                        notificationMessages.CONSULTATION
                            .PSYCHOLOGIST_CONSULTATION_REMINDER,
                    read: false,
                    notifyAt: oneHourBefore,
                    sent: false,
                });

                console.log(
                    `Consultation ${consultation.id} created for session ${sessionId}`,
                );
            }

            // handle wallet top-up
            if (meta.purpose === PaymentPurpose.WALLET) {
                const wallet = await this._walletRepo.findByUserId(
                    payment.userId,
                );
                if (!wallet) {
                    throw new AppError(
                        walletMessages.ERROR.NOT_FOUND,
                        HttpStatus.NOT_FOUND,
                    );
                }

                await this._walletRepo.createTransaction({
                    walletId: wallet.id,
                    amount: payment.amount,
                    type: WalletTransactionType.CREDIT,
                    reference: payment.id.toString(),
                    metadata: { stripeSessionId: sessionId },
                    status: WalletTransactionStatus.COMPLETED,
                });

                await this._walletRepo.updateBalance(
                    wallet.id,
                    payment.amount,
                );

                payment.paymentStatus = PaymentStatus.SUCCEEDED;
                payment.transactionId =
                    (session.payment_intent as string) ?? null;
                await this._paymentRepo.updateBySessionId(
                    sessionId,
                    payment,
                );
                console.log(
                    `Wallet credited for user ${payment.userId} for session ${sessionId}`,
                );
            }

            // handle subscription purchase
            if (meta.purpose === PaymentPurpose.SUBSCRIPTION) {
                console.log('handling subscription purchase in webhook');
                // For future subscription
                const stripeSubscriptionId = session.subscription as string;

                if (!stripeSubscriptionId) {
                    throw new AppError(
                        bookingMessages.ERROR.MISSING_METADATA,
                        HttpStatus.BAD_REQUEST,
                    );
                }
                const stripeCustomerId = session.customer as string;

                if (!stripeCustomerId) {
                    throw new AppError(
                        bookingMessages.ERROR.MISSING_METADATA,
                        HttpStatus.BAD_REQUEST,
                    );
                }
                const planId = meta.planId;
                console.log('planId in webhook: ', planId);
                if (!planId) {
                    throw new AppError(
                        bookingMessages.ERROR.MISSING_METADATA,
                        HttpStatus.BAD_REQUEST,
                    );
                }

                const plan = await this._planRepo.findById(planId);
                if (!plan) {
                    throw new AppError(
                        bookingMessages.ERROR.MISSING_METADATA,
                        HttpStatus.BAD_REQUEST,
                    );
                }

                const existingSubscription =
                    await this._subscriptionRepo.findActiveByUserId(
                        payment.userId,
                    );

                const currentPeriodStart = new Date();
                const currentPeriodEnd = new Date();

                if (plan.billingPeriod === PlanBillingPeriod.MONTH) {
                    currentPeriodEnd.setMonth(
                        currentPeriodEnd.getMonth() + 1,
                    );
                } else if (plan.billingPeriod === PlanBillingPeriod.YEAR) {
                    currentPeriodEnd.setFullYear(
                        currentPeriodEnd.getFullYear() + 1,
                    );
                } else if (plan.billingPeriod === PlanBillingPeriod.WEEK) {
                    currentPeriodEnd.setDate(
                        currentPeriodEnd.getDate() + 7,
                    );
                }

                if (existingSubscription) {
                    await this._subscriptionRepo.updateById(
                        existingSubscription.subscription.id,
                        {
                            planId: plan.id,
                            stripeSubscriptionId,
                            stripeCustomerId,
                            amount: plan.price,
                            currency: plan.currency,
                            creditRemaining: plan.creditsPerPeriod,
                            creditsPerPeriod: plan.creditsPerPeriod,
                            status: SubscriptionStatus.ACTIVE,
                            currentPeriodStart,
                            currentPeriodEnd,
                        },
                    );
                } else {
                    await this._subscriptionRepo.create({
                        userId: payment.userId,
                        planId: plan.id,
                        stripeSubscriptionId,
                        stripeCustomerId,
                        amount: plan.price,
                        currency: plan.currency,
                        creditRemaining: plan.creditsPerPeriod,
                        creditsPerPeriod: plan.creditsPerPeriod,
                        status: SubscriptionStatus.ACTIVE,
                        currentPeriodStart,
                        currentPeriodEnd,
                    });
                }

                payment.paymentStatus = PaymentStatus.SUCCEEDED;
                payment.transactionId =
                    (session.payment_intent as string) ?? null;
                await this._paymentRepo.updateBySessionId(
                    sessionId,
                    payment,
                );
                console.log(
                    `Subscription created/updated for user ${payment.userId} for session ${sessionId}`,
                );
            }
            break;
        }

        // subscription renewal successful
        case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice & {
                subscription?: string;
            };
            if (typeof invoice.subscription === 'string') {
                const stripeSubscriptionId = invoice.subscription;

                const sub =
                    await this._subscriptionRepo.findByStripeSubscriptionId(
                        stripeSubscriptionId,
                    );
                if (sub) {
                    // reset credits on renewal
                    sub.creditRemaining = sub.creditsPerPeriod;
                    sub.currentPeriodStart = new Date(
                        invoice.period_start * 1000,
                    );
                    sub.currentPeriodEnd = new Date(
                        invoice.period_end * 1000,
                    );
                    sub.status = SubscriptionStatus.ACTIVE;
                    await this._subscriptionRepo.updateById(sub.id, sub);
                    console.log(
                        `Subscription renewed and credits reset for user ${sub.userId}`,
                    );
                }
            }

            break;
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice & {
                subscription?: string;
            };
            const stripeSubscriptionId = invoice.subscription as string;
            const sub =
                await this._subscriptionRepo.findByStripeSubscriptionId(
                    stripeSubscriptionId,
                );
            if (!sub) break;
            await this._subscriptionRepo.updateById(sub.id, {
                status: SubscriptionStatus.PAST_DUE,
                updatedAt: new Date(),
            });
            break;
        }

        // Handle subscription cancellation
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const sub =
                await this._subscriptionRepo.findByStripeSubscriptionId(
                    subscription.id,
                );
            if (sub) {
                sub.status = SubscriptionStatus.CANCELED;
                sub.canceledAt = new Date();
                await this._subscriptionRepo.updateById(sub.id, sub);
                console.log(`Subscription canceled for user ${sub.userId}`);
            }
            break;
        }

        case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;

            const payment =
                await this._paymentRepo.findBySessionId(sessionId);
            if (!payment) {
                throw new AppError(
                    bookingMessages.ERROR.PAYMENT_NOT_FOUND,
                    HttpStatus.NOT_FOUND,
                );
            }

            payment.paymentStatus = PaymentStatus.FAILED;
            await this._paymentRepo.updateBySessionId(sessionId, payment);
            break;
        }
        default:
            console.log(`Unhandled event type: ${event.type}`);
            break;
        }
    }
}
