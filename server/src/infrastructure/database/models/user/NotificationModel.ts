import { Schema, model, Document, Model, Types } from 'mongoose';

export interface INotificationDocument extends Document {
  _id: Types.ObjectId;
  senderId?: Types.ObjectId;
  recipientId: Types.ObjectId;
  consultationId?: Types.ObjectId;
  type:
    | 'CONSULTATION_BOOKED'
    | 'CONSULTATION_CANCELLED'
    | 'CONSULTATION_REMINDER'
    | 'NEW_MESSAGE'
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'FEEDBACK_RECEIVED';
  message: string;
  read: boolean;
  notifyAt: Date;
  sent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        recipientId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        consultationId: {
            type: Schema.Types.ObjectId,
            ref: 'Consultation',
            required: false,
        },
        type: {
            type: String,
            enum: ['CONSULTATION_BOOKED', 'CONSULTATION_CANCELLED', 'CONSULTATION_REMINDER', 'NEW_MESSAGE', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'FEEDBACK_RECEIVED'],
        },
        message: {
            type: String,
            required: true,
        },
        read: { 
            type: Boolean,
            default: false,
        },
        notifyAt: { 
            type: Date,
        },
        sent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

export const NotificationModel: Model<INotificationDocument> = model<INotificationDocument>('Notification', notificationSchema);