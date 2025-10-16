import { Message } from '@/domain/entities/message';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import { IGetHistoryUseCase } from '@/useCases/interfaces/chat/IGetHistoryUseCase';

export class GetHistoryUseCase implements IGetHistoryUseCase {
    private _messageRepo: IMessageRepository;

    constructor(messageRepo: IMessageRepository) {
        this._messageRepo = messageRepo;
    }

    async execute(
        consultationId: string,
        before?: string,
        limit?: number,
    ): Promise<Message[]> {
        const finalLimit = limit ? limit : 30;
        return this._messageRepo.findHistory(
            consultationId,
            finalLimit,
            before,
        );
    }
}
