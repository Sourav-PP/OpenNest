import { Message } from '@/domain/entities/message';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import {
    IMessageDocument,
    MessageModel,
} from '@/infrastructure/database/models/user/Message';
import { FilterQuery, Types } from 'mongoose';
import { GenericRepository } from '../GenericRepository';
import { MessageStatus } from '@/domain/enums/MessageEnums';

export class MessageRepository extends GenericRepository<Message, IMessageDocument> implements IMessageRepository {
    constructor() {
        super(MessageModel);
    }

    protected map(doc: IMessageDocument): Message {
        const mapped = super.map(doc);
        
        return {
            id: mapped.id,
            roomId: mapped.roomId,
            clientId: mapped.clientId,
            senderId: mapped.senderId as string,
            receiverId: mapped.receiverId as string,
            content: mapped.content,
            status: mapped.status,
            deliveredTo: (mapped.deliveredTo as Types.ObjectId[] | undefined)?.map(id => id.toString()) ?? [],
            readAt: mapped.readAt ?? undefined,
            mediaUrl: mapped.mediaUrl ?? undefined,
            mediaType: mapped.mediaType ?? null,
            deleted: mapped.deleted,
            deletedBy: mapped.deletedBy ?? undefined,
            replyToId: mapped.replyToId as string | undefined,
            reaction: (mapped.reaction as Array<{ userId: string; emoji: string }> | undefined)?.map(r => ({
                userId: r.userId.toString(),
                emoji: r.emoji,
            })) ?? [],
            createdAt: mapped.createdAt, 
            updatedAt: mapped.updatedAt,
        };
    }

    async findByRoomId(roomId: string): Promise<Message[]> {
        const docs = await MessageModel.find({ roomId })
            .sort({ createdAt: 1 })
            .exec();

        return docs.map(doc => this.map(doc));
    }

    async findByClientId(
        roomId: string,
        clientId: string,
    ): Promise<Message | null> {
        const message = await MessageModel.findOne({
            roomId,
            clientId,
        }).exec();
        if (!message) return null;

        return this.map(message);
    }

    async findHistory(
        roomId: string,
        limit: number,
        before?: string,
    ): Promise<Message[]> {
        const query: FilterQuery<IMessageDocument> = { roomId };

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
        roomId: string,
        messageIds: string[],
        userId: string,
    ): Promise<void> {
        await MessageModel.updateMany(
            {
                _id: { $in: messageIds.map(id => new Types.ObjectId(id)) },
                roomId,
            },
            {
                $set: { status: MessageStatus.READ, readAt: new Date() },
                $addToSet: { deliveredTo: new Types.ObjectId(userId) },
            },
        ).exec();
    }

    async markDelivered(
        roomId: string,
        messageIds: string[],
        userId: string,
    ): Promise<void> {
        await MessageModel.updateMany(
            {
                _id: { $in: messageIds.map(id => new Types.ObjectId(id)) },
                roomId,
            },
            {
                $addToSet: { deliveredTo: new Types.ObjectId(userId) },
                $set: { status: MessageStatus.DELIVERED },
            },
        ).exec();
    }

    async countUnread(roomId: string, userId: string): Promise<number> {
        return MessageModel.countDocuments({
            roomId,
            receiverId: userId,
            status: { $ne: MessageStatus.READ },
        });
    }

    async markAllAsRead(roomId: string, userId: string): Promise<void> {
        await MessageModel.updateMany(
            { roomId, receiverId: userId, status: { $ne: MessageStatus.READ } },
            { $set: { status: MessageStatus.READ, readAt: new Date() } },
        );
    }
}
