import { Schema, Model, model, Types, Document } from 'mongoose';

export interface IPayoutRequestDocument extends Document {
    _id: Types.ObjectId;
    psychologistId: Types.ObjectId;
    consultationIds: Types.ObjectId[];
    requestedAmount: number;
    commissionAmount: number;
    payoutAmount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt?: Date;
    updatedAt?: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
}

const payoutRequestSchema = new Schema<IPayoutRequestDocument>(
    {
        psychologistId: {
            type: Schema.Types.ObjectId,
            ref: 'Psychologist',
            required: true,
        },
        consultationIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Consultation',  
                required: true,
            },
        ],  
        requestedAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        commissionAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        payoutAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        approvedAt: {
            type: Date,
        },
        rejectedAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

export const PayoutRequestModel: Model<IPayoutRequestDocument> = model<IPayoutRequestDocument>('PayoutRequest', payoutRequestSchema);