import { Schema, Model, model, Types, Document } from 'mongoose';

export interface IComplaintDocument extends Document {
    _id: Types.ObjectId;
    consultationId: Types.ObjectId;
    userId: Types.ObjectId;
    description: string;
    status: 'pending' | 'verified' | 'rejected';
}

const complaintSchema = new Schema<IComplaintDocument>(
    {
        consultationId: {
            type: Schema.Types.ObjectId,
            ref: 'Consultation',
            required: true,
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true },
);

export const ComplaintModel: Model<IComplaintDocument> = model<IComplaintDocument>('Complaint', complaintSchema);