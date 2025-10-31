import { Message } from '../entities/message';

export interface IMessageRepository {
    create(message: Partial<Message>): Promise<Message>;
    deleteById(id: string): Promise<boolean>;
    findById(id: string): Promise<Message | null>;
    updateById(id: string, data: Partial<Omit<Message,'id'>>): Promise<Message | null>;
    findByClientId(roomId: string, clientId: string): Promise<Message | null>;
    findByRoomId(roomId: string): Promise<Message[]>;
    findHistory(roomId: string,limit: number, before?: string ): Promise<Message[]>;
    markDelivered(roomId: string, messageIds: string[], userId: string): Promise<void>;
    markRead(roomId: string, messageIds: string[], userId: string): Promise<void>;
    markAllAsRead(roomId: string, userId: string): Promise<void>;
    countUnread(roomId: string, userId: string): Promise<number>;
}
