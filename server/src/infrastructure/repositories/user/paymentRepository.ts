import { Payment } from '@/domain/entities/payment';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IPaymentDocument, PaymentModel } from '@/infrastructure/database/models/user/Payment';
import { GenericRepository } from '../GenericRepository';

export class PaymentRepository extends GenericRepository<Payment, IPaymentDocument> implements IPaymentRepository {
    constructor() {
        super(PaymentModel);
    }

    protected map(doc: IPaymentDocument): Payment {
        const mapped = super.map(doc);
        
        return {
            id: mapped.id,
            userId: mapped.userId as string,
            consultationId: mapped.consultationId as string | undefined,
            amount: mapped.amount,
            currency: mapped.currency,
            paymentMethod: mapped.paymentMethod,
            paymentStatus: mapped.paymentStatus,
            refunded: mapped.refunded,
            transactionId: mapped.transactionId,
            stripeSessionId: mapped.stripeSessionId,
            slotId: mapped.slotId as string | null,
            purpose: mapped.purpose,
        };
    }

    async updateBySessionId(sessionId: string, update: Partial<Payment>): Promise<Payment | null> {
        const doc = await PaymentModel.findOneAndUpdate(
            { stripeSessionId: sessionId },
            update,
            { new: true },
        );

        if (!doc) return null;

        return this.map(doc);
    }

    async findBySessionId(sessionId: string): Promise<Payment | null> {
        const doc = await PaymentModel.findOne({ stripeSessionId: sessionId }).exec();

        if (!doc) return null;
        return this.map(doc);
    }

    async findByConsultationId(id: string): Promise<Payment | null> {
        const payment = await PaymentModel.findOne({ consultationId: id }).exec();

        if (!payment) return null;

        return this.map(payment);
    }
}