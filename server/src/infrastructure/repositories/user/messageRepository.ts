import { Message } from '@/domain/entities/message';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import {
    IMessageDocument,
    MessageModel,
} from '@/infrastructure/database/models/user/Message';
import { FilterQuery, Types } from 'mongoose';
import { GenericRepository } from '../GenericRepository';

export class MessageRepository extends GenericRepository<Message, IMessageDocument> implements IMessageRepository {
    constructor() {
        super(MessageModel);
    }

    protected map(doc: IMessageDocument): Message {
        const mapped = super.map(doc);
        
        return {
            id: mapped.id,
            consultationId: mapped.consultationId as string,
            clientId: mapped.clientId,
            senderId: mapped.senderId as string,
            receiverId: mapped.receiverId as string,
            content: mapped.content,
            status: mapped.status,
            deliveredTo: (mapped.deliveredTo as any[])?.map(id => id.toString()) ?? [],
            readAt: mapped.readAt ?? undefined,
            mediaUrl: mapped.mediaUrl ?? undefined,
            mediaType: mapped.mediaType ?? null,
            deleted: mapped.deleted,
            deletedBy: mapped.deletedBy ?? undefined,
            replyToId: mapped.replyToId as string | undefined,
            reaction: (mapped.reaction as any[])?.map(r => ({
                userId: r.userId.toString(),
                emoji: r.emoji,
            })) ?? [],
            createdAt: mapped.createdAt, 
            updatedAt: mapped.updatedAt,
        };
    }

    async findByConsultationId(consultationId: string): Promise<Message[]> {
        const docs = await MessageModel.find({ consultationId })
            .sort({ createdAt: 1 })
            .exec();

        return docs.map(doc => this.map(doc));
    }

    async findByClientId(
        consultationId: string,
        clientId: string,
    ): Promise<Message | null> {
        const message = await MessageModel.findOne({
            consultationId,
            clientId,
        }).exec();
        if (!message) return null;

        return this.map(message);
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
            .exec();
        return rows.reverse().map(message => this.map(message));
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

    async countUnread(consultationId: string, userId: string): Promise<number> {
        return MessageModel.countDocuments({
            consultationId,
            receiverId: userId,
            status: { $ne: 'read' },
        });
    }

    async markAllAsRead(consultationId: string, userId: string): Promise<void> {
        await MessageModel.updateMany(
            { consultationId, receiverId: userId, status: { $ne: 'read' } },
            { $set: { status: 'read', readAt: new Date() } },
        );
    }
}
