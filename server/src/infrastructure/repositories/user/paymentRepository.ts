import { Payment } from '../../../domain/entities/payment';
import { IPaymentRepository } from '../../../domain/interfaces/IPaymentRepository';
import { PaymentModel } from '../../database/models/user/Payment';

export class PaymentRepository implements IPaymentRepository {
    async create(paymentData: Payment): Promise<Payment> {
        try {
            console.log('is it coming in the repo');
            const doc = await PaymentModel.create(paymentData);
            console.log('doc:', doc);
            const obj = doc.toObject();
            return {
                ...obj,
                userId: doc.userId.toString(),
                id: obj._id.toString(),
                consultationId: obj.consultationId ? obj.consultationId.toString() : undefined,
            };
        } catch (err) {
            console.error('Error in PaymentModel.create:', err);
            throw err;
        }
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