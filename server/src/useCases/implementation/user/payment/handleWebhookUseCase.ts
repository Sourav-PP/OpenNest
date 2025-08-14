import { IHandleWebhookUseCase } from '../../../interfaces/user/payment/IHandleWebhookUseCase';
import { IPaymentRepository } from '../../../../domain/interfaces/IPaymentRepository';
import { IPaymentService } from '../../../../domain/services/IPaymentService';
import { AppError } from '../../../../domain/errors/AppError';
import Stripe from 'stripe';
import { IConsultationRepository } from '../../../../domain/interfaces/IConsultationRepository';
import { ISlotRepository } from '../../../../domain/interfaces/ISlotRepository';

export class HandleWebhookUseCase implements IHandleWebhookUseCase {
    constructor(
        private paymentRepo: IPaymentRepository,
        private paymentService: IPaymentService,
        private consultationRepo: IConsultationRepository,
        private slotRepo: ISlotRepository,
    ) {}

    async execute(payload: Buffer, signature: string, endpointSecret: string): Promise<void> {
        console.log('its here in webhook before verification');
        const event = await this.paymentService.verifyWeebhookSignature(payload, signature, endpointSecret);

        console.log('its here in webhook, event type : ', event.type);

        switch (event.type) {
        case 'checkout.session.completed': {

            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;
            const meta = session.metadata || {};

            console.log('meta in webhook', meta);

            if (!meta.psychologistId || !meta.slotId || !meta.startDateTime || !meta.endDateTime) {
                throw new AppError('Missing required booking metadata', 400);
            }

            const payment = await this.paymentRepo.findBySessionId(sessionId);

            if (!payment) {
                throw new AppError('Payment not found for the session ID', 404);
            }

            const slot = await this.slotRepo.findById(meta.slotId);
            if (!slot || slot.isBooked) {
                throw new AppError('Slot no longer available', 409);
            }

            if (payment.consultationId) {
                throw new AppError('Consultation already exists for payment');
            }

            console.log('startdatetime: ',meta.stardDateTime);
            console.log('endatetime: ', meta.endatetime);
            // create consultation
            const consultation = await this.consultationRepo.createConsultation({
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

            await this.paymentRepo.updateBySessionId(sessionId, payment);

            await this.slotRepo.markSlotAsBooked(meta.slotId, payment.userId);
            console.log(`Consultation ${consultation.id} created for session ${sessionId}`);
            break;

        }
                
        case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;

            const payment = await this.paymentRepo.findBySessionId(sessionId);
            if (!payment) {
                throw new AppError('Payment not found for the session ID', 404);
            }

            payment.paymentStatus = 'failed';
            await this.paymentRepo.updateBySessionId(sessionId, payment);
            break;
        }
        }
    }
}