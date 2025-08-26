import { Message } from '../entities/message';

export interface IMessageRepository {
    create(message: Partial<Message>): Promise<Message>;
    findByClientId(consultationId: string, clientId: string): Promise<Message | null>;
    findByConsultationId(consultationId: string): Promise<Message[]>;
    findHistory(consultationId: string,limit: number, before?: string ): Promise<Message[]>;
    markDelivered(consultationId: string, messageIds: string[], userId: string): Promise<void>;
    markRead(consultationId: string, messageIds: string[], userId: string): Promise<void>;
}
