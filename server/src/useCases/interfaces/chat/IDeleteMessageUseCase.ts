import { Message } from '@/domain/entities/message';

export interface IDeleteMessageUseCase {
    execute(messageId: string, deletedBy: string): Promise<Message>;
}
