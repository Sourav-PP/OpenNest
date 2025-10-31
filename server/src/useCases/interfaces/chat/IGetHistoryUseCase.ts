import { Message } from '@/domain/entities/message';

export interface IGetHistoryUseCase {
    execute(
        roomId: string,
        before?: string,
        limit?: number,
    ): Promise<Message[]>;
}
