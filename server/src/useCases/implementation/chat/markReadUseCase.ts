import { IMarkReadUseCase } from '@/useCases/interfaces/chat/IMarkReadUseCase';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';

export class MarkReadUseCase implements IMarkReadUseCase {
    private _messageRepo: IMessageRepository;

    constructor(messageRepo: IMessageRepository) {
        this._messageRepo = messageRepo;
    }

    async execute(
        consultationId: string,
        messageIds: string[],
        userId: string,
    ): Promise<void> {
        await this._messageRepo.markRead(consultationId, messageIds, userId);
    }
}
