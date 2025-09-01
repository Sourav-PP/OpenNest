import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IMessageDocument extends Document {
    _id: Types.ObjectId;
    consultationId: Types.ObjectId;
    clientId?: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    status: 'sent' | 'delivered' | 'read';
    deliveredTo?: Types.ObjectId[];
    readAt?: Date;
    mediaUrl?: string | null;
    mediaType?: string | null;
    deleted: boolean;
    replyToId?: Types.ObjectId;
    reaction?: Array<{ userId: string; emoji: string }>;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessageDocument>(
    {
        consultationId: {
            type: Schema.Types.ObjectId,
            ref: 'Consultation',
            required: true,
        },
        clientId: {
            type: String,
            required: false,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: false,
            default: '',
        },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent',
        },
        deliveredTo: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        readAt: {
            type: Date,
        },
        mediaUrl: {
            type: String,
            required: false,
        },
        mediaType: {
            type: String,
            enum: ['image', 'audio', 'video', 'file', null],
            default: null,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        replyToId: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
        reaction: [
            {
                userId: { type: String, required: true },
                emoji: { type: String, required: true },
            },
        ],
    },
    { timestamps: true },
);

export const MessageModel: Model<IMessageDocument> = model<IMessageDocument>('Message', messageSchema);