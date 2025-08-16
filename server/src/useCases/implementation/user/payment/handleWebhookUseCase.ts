import { IHandleWebhookUseCase } from '@/useCases/interfaces/user/payment/IHandleWebhookUseCase';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IPaymentService } from '@/domain/serviceInterface/IPaymentService';
import { AppError } from '@/domain/errors/AppError';
import Stripe from 'stripe';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';



export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    private _paymentRepo: IPaymentRepository;
    private _paymentService: IPaymentService;
    private _consultationRepo: IConsultationRepository;
    private _slotRepo: ISlotRepository;

    constructor(
        paymentRepo: IPaymentRepository,
        paymentService: IPaymentService,
        consultationRepo: IConsultationRepository,
        slotRepo: ISlotRepository,
    ) {
        this._paymentRepo = paymentRepo;
        this._paymentService = paymentService;
        this._consultationRepo = consultationRepo;
        this._slotRepo = slotRepo;
    }

    async execute(payload: Buffer, signature: string, endpointSecret: string): Promise<void> {

        const event = await this._paymentService.verifyWebhookSignature(payload, signature, endpointSecret);

        switch (event.type) {
        case 'checkout.session.completed': {

            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;
            const meta = session.metadata || {};

            if (!meta.psychologistId || !meta.slotId || !meta.startDateTime || !meta.endDateTime) {
                throw new AppError(bookingMessages.ERROR.MISSING_METADATA, HttpStatus.BAD_REQUEST);
            }

            const payment = await this._paymentRepo.findBySessionId(sessionId);

            if (!payment) {
                throw new AppError(bookingMessages.ERROR.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const slot = await this._slotRepo.findById(meta.slotId);
            if (!slot || slot.isBooked) {
                throw new AppError(bookingMessages.ERROR.SLOT_NOT_AVAILABLE, HttpStatus.CONFLICT);
            }

            if (payment.consultationId) {
                throw new AppError(bookingMessages.ERROR.CONSULTATION_EXISTS, HttpStatus.CONFLICT);
            }

            // create consultation
            const consultation = await this._consultationRepo.createConsultation({
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

            // update the payment status
            payment.paymentStatus = 'succeeded';
            payment.transactionId = session.payment_intent as string ?? null;
            payment.consultationId = consultation.id;

            await this._paymentRepo.updateBySessionId(sessionId, payment);

            await this._slotRepo.markSlotAsBooked(meta.slotId, payment.userId);
            console.log(`Consultation ${consultation.id} created for session ${sessionId}`);
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
        }
    }
}