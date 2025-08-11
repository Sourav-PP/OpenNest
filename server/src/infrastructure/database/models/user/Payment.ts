import { Schema, model, Document, Model, Types } from "mongoose";

export interface IPaymentDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    consultationId: Types.ObjectId;
    amount: number;
    currency: string;
    paymentMethod: 'stripe' | 'wallet';
    paymentStatus: "pending" | "succeeded" | "failed";
    refunded: boolean;
    transactionId?: string;
    stripeSessionId?: string;
}

const PaymentSchema = new Schema<IPaymentDocument>(
    {
        consultationId: {
            type: Schema.Types.ObjectId,
            ref: "Consultation",
            required: false
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            uppercase: true,
        },
        paymentMethod: {
            type: String,
            enum: ['stripe', 'wallet'],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "succeeded", "failed"],
            required: true
        },
        refunded: {
            type: Boolean,
            default: false
        },
        transactionId: {
            type: String
        },
        stripeSessionId: {
            type: String,
        },
    },
    { timestamps: true }
)

export const PaymentModel: Model<IPaymentDocument> = model<IPaymentDocument>("Payment", PaymentSchema)