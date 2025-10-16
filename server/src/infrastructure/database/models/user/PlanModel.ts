import { PlanBillingPeriod } from '@/domain/enums/PlanEnums';
import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IPlanDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    currency: string;
    creditsPerPeriod: number;
    billingPeriod: PlanBillingPeriod;
    stripePriceId: string;
    createdAt: Date;
    updatedAt: Date;
}

const PlanSchema = new Schema<IPlanDocument>(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        currency: { type: String, required: true, default: 'usd' },
        creditsPerPeriod: { type: Number, required: true },
        billingPeriod: {
            type: String,
            enum: Object.values(PlanBillingPeriod),
            required: true,
        },
        stripePriceId: { type: String, required: true },
    },
    { timestamps: true }, 
);

export const PlanModel: Model<IPlanDocument> = model<IPlanDocument>('Plan', PlanSchema);
