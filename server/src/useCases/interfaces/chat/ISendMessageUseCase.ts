import { Message } from '@/domain/entities/message';
import { ISendMessageInput } from '@/useCases/types/chatTypes';

export interface ISendMessageUseCase {
    execute(data: ISendMessageInput): Promise<Message>;
}
