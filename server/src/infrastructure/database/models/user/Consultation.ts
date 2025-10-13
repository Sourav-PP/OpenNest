import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IConsultationDocument extends Document {
    _id: Types.ObjectId;
    patientId: Types.ObjectId;
    psychologistId: Types.ObjectId;
    subscriptionId?: Types.ObjectId;
    slotId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed';
    paymentStatus: 'pending' | 'paid' | 'failed'
    paymentMethod: 'stripe' | 'wallet' | 'subscription' | null
    paymentIntentId: string | null
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
            enum: ['booked', 'cancelled', 'completed', 'rescheduled', 'missed'],
            default: 'booked',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['stripe', 'wallet', 'subscription'],
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