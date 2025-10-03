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



export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    private _paymentRepo: IPaymentRepository;
    private _paymentService: IPaymentService;
    private _consultationRepo: IConsultationRepository;
    private _slotRepo: ISlotRepository;
    private _walletRepo: IWalletRepository;
    private _videoCallService: IVideoCallService;
    private _videoCallRepo: IVideoCallRepository;

    constructor(
        paymentRepo: IPaymentRepository,
        paymentService: IPaymentService,
        consultationRepo: IConsultationRepository,
        slotRepo: ISlotRepository,
        walletRepo: IWalletRepository,
        videoCallService: IVideoCallService,
        videoCallRepo: IVideoCallRepository,
    ) {
        this._paymentRepo = paymentRepo;
        this._paymentService = paymentService;
        this._consultationRepo = consultationRepo;
        this._slotRepo = slotRepo;
        this._walletRepo = walletRepo;
        this._videoCallService = videoCallService;
        this._videoCallRepo = videoCallRepo;
    }

    async execute(payload: Buffer, signature: string, endpointSecret: string): Promise<void> {

        console.log('webhook triggered!');
        const event = await this._paymentService.verifyWebhookSignature(payload, signature, endpointSecret);

        switch (event.type) {
        case 'checkout.session.completed': {

            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;
            const meta = session.metadata || {};

            console.log('meta in webhook: ', meta);

            const payment = await this._paymentRepo.findBySessionId(sessionId);
            console.log('payment: ', payment);

            if (!payment) {
                throw new AppError(bookingMessages.ERROR.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (meta.purpose === 'consultation') {

                if (!meta.psychologistId || !meta.slotId || !meta.startDateTime || !meta.endDateTime) {
                    throw new AppError(bookingMessages.ERROR.MISSING_METADATA, HttpStatus.BAD_REQUEST);
                }

                const slot = await this._slotRepo.findById(meta.slotId);
                console.log('slot in webhook: ', slot);
                if (!slot || slot.isBooked) {
                    throw new AppError(bookingMessages.ERROR.SLOT_NOT_AVAILABLE, HttpStatus.CONFLICT);
                }

                if (payment.consultationId) {
                    throw new AppError(bookingMessages.ERROR.CONSULTATION_EXISTS, HttpStatus.CONFLICT);
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
                    status: 'booked',
                    paymentStatus: 'paid',
                    paymentMethod: 'stripe',
                    paymentIntentId: session.payment_intent as string || null,
                    includedInPayout: false,
                });

                const meetingLink = await this._videoCallService.generateMeetingLink(consultation.id);
                consultation.meetingLink = meetingLink;
                await this._consultationRepo.updateConsultation(consultation.id, { meetingLink });

                await this._videoCallRepo.create({
                    consultationId: consultation.id,
                    patientId: consultation.patientId,
                    psychologistId: consultation.psychologistId,
                    callUrl: meetingLink,
                    status: 'scheduled',
                    startedAt: null,
                    endedAt: null,
                });
                // update the payment status
                payment.paymentStatus = 'succeeded';
                payment.transactionId = session.payment_intent as string ?? null;
                payment.consultationId = consultation.id;

                await this._paymentRepo.updateBySessionId(sessionId, payment);

                await this._slotRepo.markSlotAsBooked(meta.slotId, payment.userId);
                console.log(`Consultation ${consultation.id} created for session ${sessionId}`);
            }

            if (meta.purpose === 'wallet') {
                console.log('its in wallet handler');
                console.log('payment in wallet handle block', payment);
                const wallet = await this._walletRepo.findByUserId(payment.userId);

                if (!wallet) {
                    throw new AppError(walletMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
                }
                
                await this._walletRepo.createTransaction({
                    walletId: wallet.id,
                    amount: payment.amount,
                    type: 'credit',
                    reference: payment.id.toString(),
                    metadata: { stripeSessionId: sessionId },
                    status: 'completed',
                });

                await this._walletRepo.updateBalance(wallet.id, payment.amount);

                payment.paymentStatus = 'succeeded';
                payment.transactionId = session.payment_intent as string ?? null;
                await this._paymentRepo.updateBySessionId(sessionId, payment);
                console.log(`Wallet credited for user ${payment.userId} for session ${sessionId}`);
            }
            break;
        }
                
        case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;

            const payment = await this._paymentRepo.findBySessionId(sessionId);
            if (!payment) {
                throw new AppError(bookingMessages.ERROR.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            payment.paymentStatus = 'failed';
            await this._paymentRepo.updateBySessionId(sessionId, payment);
            break;
        }   
        default:
            console.log(`Unhandled event type: ${event.type}`);
            break;  
        }         
    }
}
