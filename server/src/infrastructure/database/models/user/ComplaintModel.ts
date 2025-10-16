import { ComplaintStatus } from '@/domain/enums/ComplaintEnums';
import { Schema, Model, model, Types, Document } from 'mongoose';

export interface IComplaintDocument extends Document {
    _id: Types.ObjectId;
    consultationId: Types.ObjectId;
    userId: Types.ObjectId;
    description: string;
    status: ComplaintStatus;
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
            enum: Object.values(ComplaintStatus),
            default: ComplaintStatus.PENDING,
        },
    },
    { timestamps: true },
);

export const ComplaintModel: Model<IComplaintDocument> = model<IComplaintDocument>('Complaint', complaintSchema);