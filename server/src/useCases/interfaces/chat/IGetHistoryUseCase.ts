import { Message } from '@/domain/entities/message';

export interface IGetHistoryUseCase {
    execute(
        consultationId: string,
        before?: string,
        limit?: number,
    ): Promise<Message[]>;
}
