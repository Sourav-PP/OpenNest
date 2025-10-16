import { SubscriptionStatus } from '@/domain/enums/PlanEnums';
import { Schema, model, Document, Model, Types } from 'mongoose';

export interface ISubscriptionDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    planId: Types.ObjectId;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    amount: number;
    currency: string;
    creditRemaining: number;
    creditsPerPeriod: number;
    status: SubscriptionStatus;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    canceledAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const subscriptionSchema = new Schema<ISubscriptionDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            required: true,
        },
        stripeSubscriptionId: {
            type: String,
            required: true,
        },
        stripeCustomerId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            default: 'usd',
        },
        creditRemaining: {
            type: Number,
            required: true,
        },
        creditsPerPeriod: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(SubscriptionStatus),
            required: true,
        },
        currentPeriodStart: {
            type: Date,
        },
        currentPeriodEnd: {
            type: Date,
        },
        canceledAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

export const SubscriptionModel: Model<ISubscriptionDocument> = model<ISubscriptionDocument>('Subscription', subscriptionSchema);
