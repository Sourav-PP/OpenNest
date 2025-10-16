import { PaymentMethod, PaymentPurpose, PaymentStatus } from '@/domain/enums/PaymentEnums';
import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IPaymentDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    consultationId: Types.ObjectId;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    refunded: boolean;
    transactionId?: string;
    stripeSessionId?: string;
    slotId: Types.ObjectId;
    purpose: PaymentPurpose;
}

const PaymentSchema = new Schema<IPaymentDocument>(
    {
        consultationId: {
            type: Schema.Types.ObjectId,
            ref: 'Consultation',
            required: false,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            uppercase: true,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            required: true,
        },
        refunded: {
            type: Boolean,
            default: false,
        },
        transactionId: {
            type: String,
        },
        stripeSessionId: {
            type: String,
        },
        slotId: {
            type: Schema.Types.ObjectId,
            ref: 'slots',
            required: false,
        },
        purpose: {
            type: String,
            enum: Object.values(PaymentPurpose),
            required: true,
        },
    },
    { timestamps: true },
);

PaymentSchema.index(
    { slotId: 1, paymentStatus: 1 },
    {
        unique: true,
        partialFilterExpression: {
            purpose: 'consultation', 
            paymentStatus: { $in: ['pending', 'succeeded'] },
        },
        name: 'unique_slot_payment_consultation',
    },
);

export const PaymentModel: Model<IPaymentDocument> = model<IPaymentDocument>('Payment', PaymentSchema);