import { Message } from '../entities/message';

export interface IMessageRepository {
    create(message: Partial<Message>): Promise<Message>;
    deleteById(id: string): Promise<boolean>;
    findById(id: string): Promise<Message | null>;
    updateById(id: string, data: Partial<Omit<Message,'id'>>): Promise<Message | null>;
    findByClientId(consultationId: string, clientId: string): Promise<Message | null>;
    findByConsultationId(consultationId: string): Promise<Message[]>;
    findHistory(consultationId: string,limit: number, before?: string ): Promise<Message[]>;
    markDelivered(consultationId: string, messageIds: string[], userId: string): Promise<void>;
    markRead(consultationId: string, messageIds: string[], userId: string): Promise<void>;
    markAllAsRead(consultationId: string, userId: string): Promise<void>;
    countUnread(consultationId: string, userId: string): Promise<number>;
}
