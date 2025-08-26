import { Message } from '@/domain/entities/message';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import {
    IMessageDocument,
    MessageModel,
} from '@/infrastructure/database/models/user/Message';
import { FilterQuery, Types } from 'mongoose';

export class MessageRepository implements IMessageRepository {
    async create(message: Partial<Message>): Promise<Message> {
        const doc = await MessageModel.create(message);
        return {
            id: doc._id.toString(),
            consultationId: doc.consultationId.toString(),
            clientId: doc.clientId,
            senderId: doc.senderId.toString(),
            receiverId: doc.receiverId.toString(),
            content: doc.content,
            status: doc.status,
            deliveredTo: doc.deliveredTo?.map(id => id.toString()) ?? [],
            readAt: doc.readAt ?? undefined,
            mediaUrl: doc.mediaUrl ?? undefined,
            mediaType: doc.mediaType ?? null,
            deleted: doc.deleted,
            replyToId: doc.replyToId?.toString(),
            reaction:
                doc.reaction?.map(r => ({
                    userId: r.userId.toString(),
                    emoji: r.emoji,
                })) ?? [],
        };
    }

    async findByConsultationId(consultationId: string): Promise<Message[]> {
        const docs = await MessageModel.find({ consultationId })
            .sort({ createdAt: 1 })
            .lean();

        return docs.map(doc => ({
            id: doc._id.toString(),
            consultationId: doc.consultationId.toString(),
            clientId: doc.clientId,
            senderId: doc.senderId.toString(),
            receiverId: doc.receiverId.toString(),
            content: doc.content,
            status: doc.status,
            deliveredTo: doc.deliveredTo?.map(id => id.toString()) ?? [],
            readAt: doc.readAt ?? undefined,
            mediaUrl: doc.mediaUrl ?? undefined,
            mediaType: doc.mediaType ?? null,
            deleted: doc.deleted,
            replyToId: doc.replyToId?.toString(),
            reaction:
                doc.reaction?.map(r => ({
                    userId: r.userId.toString(),
                    emoji: r.emoji,
                })) ?? [],
        }));
    }

    async findByClientId(
        consultationId: string,
        clientId: string,
    ): Promise<Message | null> {
        const message = await MessageModel.findOne({
            consultationId,
            clientId,
        }).lean();
        if (!message) return null;

        return {
            id: message._id.toString(),
            consultationId: message.consultationId.toString(),
            clientId: message.clientId,
            senderId: message.senderId.toString(),
            receiverId: message.receiverId.toString(),
            content: message.content,
            status: message.status,
            deliveredTo: message.deliveredTo?.map(id => id.toString()) ?? [],
            readAt: message.readAt ?? undefined,
            mediaUrl: message.mediaUrl ?? undefined,
            mediaType: message.mediaType ?? null,
            deleted: message.deleted,
            replyToId: message.replyToId?.toString(),
            reaction:
                message.reaction?.map(r => ({
                    userId: r.userId.toString(),
                    emoji: r.emoji,
                })) ?? [],
        };
    }

    async findHistory(
        consultationId: string,
        limit: number,
        before?: string,
    ): Promise<Message[]> {
        const query: FilterQuery<IMessageDocument> = { consultationId };

        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const rows = await MessageModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return rows.reverse().map(message => ({
            id: message._id.toString(),
            consultationId: message.consultationId.toString(),
            clientId: message.clientId,
            senderId: message.senderId.toString(),
            receiverId: message.receiverId.toString(),
            content: message.content,
            status: message.status,
            deliveredTo: message.deliveredTo?.map(id => id.toString()) ?? [],
            readAt: message.readAt ?? undefined,
            mediaUrl: message.mediaUrl ?? undefined,
            mediaType: message.mediaType ?? null,
            deleted: message.deleted,
            replyToId: message.replyToId?.toString(),
            reaction:
                message.reaction?.map(r => ({
                    userId: r.userId.toString(),
                    emoji: r.emoji,
                })) ?? [],
            createdAt: message.createdAt, 
            updatedAt: message.updatedAt,
        }));
    }

    async markRead(
        consultationId: string,
        messageIds: string[],
        userId: string,
    ): Promise<void> {
        await MessageModel.updateMany(
            {
                _id: { $in: messageIds.map(id => new Types.ObjectId(id)) },
                consultationId,
            },
            {
                $set: { status: 'read', readAt: new Date() },
                $addToSet: { deliveredTo: new Types.ObjectId(userId) },
            },
        ).exec();
    }

    async markDelivered(
        consultationId: string,
        messageIds: string[],
        userId: string,
    ): Promise<void> {
        await MessageModel.updateMany(
            {
                _id: { $in: messageIds.map(id => new Types.ObjectId(id)) },
                consultationId,
            },
            {
                $addToSet: { deliveredTo: new Types.ObjectId(userId) },
                $set: { status: 'delivered' },
            },
        ).exec();
    }
}
