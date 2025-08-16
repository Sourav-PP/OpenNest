import { Payment } from '@/domain/entities/payment';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { PaymentModel } from '@/infrastructure/database/models/user/Payment';

export class PaymentRepository implements IPaymentRepository {
    async create(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
        const doc = await PaymentModel.create(paymentData);
        const obj = doc.toObject();
        return {
            ...obj,
            userId: doc.userId.toString(),
            id: obj._id.toString(),
            consultationId: obj.consultationId ? obj.consultationId.toString() : undefined,
        };
    }

    async updateBySessionId(sessionId: string, update: Partial<Payment>): Promise<Payment | null> {
        const doc = await PaymentModel.findOneAndUpdate(
            { stripeSessionId: sessionId },
            update,
            { new: true },
        );

        if (!doc) return null;

        const obj = doc.toObject();

        return {
            ...obj,
            userId: doc.userId.toString(),
            id: obj._id.toString(),
            consultationId: obj.consultationId.toString(),
        };
    }

    async findBySessionId(sessionId: string): Promise<Payment | null> {
        const doc = await PaymentModel.findOne({ stripeSessionId: sessionId }).lean();

        if (!doc) return null;
        return {
            ...doc,
            userId: doc.userId.toString(),
            id: doc._id.toString(),
            consultationId: doc.consultationId ? doc.consultationId.toString() : undefined,
        };
    }
}