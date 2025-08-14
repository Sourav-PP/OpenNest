import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IConsultaionDocument extends Document {
    _id: Types.ObjectId;
    patientId: Types.ObjectId;
    psychologistId: Types.ObjectId;
    subscriptionId?: Types.ObjectId;
    slotId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    issue?: Types.ObjectId[];
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    paymentStatus: 'pending' | 'paid' | 'failed'
    paymentMethod: 'stripe' | 'wallet' | null
    paymentIntentId: string | null
    cancellationReason?: string;
    cancelledAt?: Date;
    includedInPayout: boolean;
    meetingLink?: string;
}

const ConsultationSchema = new Schema<IConsultaionDocument>(
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
        issue: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Service',
                default: [],
            },
        ],
        status: {
            type: String,
            enum: ['booked', 'cancelled', 'completed', 'rescheduled'],
            default: 'booked',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['stripe', 'wallet'],
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

export const ConsultationModel: Model<IConsultaionDocument> = model<IConsultaionDocument>('Consultation', ConsultationSchema);