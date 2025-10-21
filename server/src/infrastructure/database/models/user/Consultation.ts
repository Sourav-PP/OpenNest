import { Schema, model, Document, Model, Types } from 'mongoose';
import { ConsultationPaymentMethod, ConsultationPaymentStatus, ConsultationStatus } from '@/domain/enums/ConsultationEnums';

export interface IConsultationDocument extends Document {
    _id: Types.ObjectId;
    patientId: Types.ObjectId;
    psychologistId: Types.ObjectId;
    subscriptionId?: Types.ObjectId;
    slotId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: ConsultationStatus;
    paymentStatus: ConsultationPaymentStatus;
    paymentMethod: ConsultationPaymentMethod;
    paymentIntentId: string | null
    notes?: {
        privateNotes?: string;
        feedback?: string;
        updatedAt?: Date;
    };
    cancellationReason?: string;
    cancelledAt?: Date;
    includedInPayout: boolean;
    meetingLink?: string;
}

const ConsultationSchema = new Schema<IConsultationDocument>(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        psychologistId: {
            type: Schema.Types.ObjectId,
            ref: 'Psychologist',
            required: true,
        },
        subscriptionId: {
            type: Schema.Types.ObjectId,
            ref: 'Subscription',
            required: false,
        },
        slotId: {
            type: Schema.Types.ObjectId,
            ref: 'Slot',
            required: true,
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true,
        },
        sessionGoal: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(ConsultationStatus),
            default: ConsultationStatus.BOOKED,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(ConsultationPaymentStatus),
            default: ConsultationPaymentStatus.PENDING,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(ConsultationPaymentMethod),
        },
        notes: {
            privateNotes: { type: String, default: '' },
            feedback: { type: String, default: '' },
            updatedAt: { type: Date, default: null },
        },
        cancellationReason: { 
            type: String,
            default: null, 
        },
        cancelledAt: { 
            type: Date, 
            default: null,
        },
        includedInPayout: {
            type: Boolean,
            default: false,
        },
        meetingLink: {
            type: String, 
            default: null, 
        },
    },
    { timestamps: true },
);

export const ConsultationModel: Model<IConsultationDocument> = model<IConsultationDocument>('Consultation', ConsultationSchema);