import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import { IMarkDeliveredUseCase } from '@/useCases/interfaces/chat/IMarkDeliveredUseCase';

export class MarkDeliveredUseCase implements IMarkDeliveredUseCase {
    private _messageRepo: IMessageRepository;

    constructor(messageRepo: IMessageRepository) {
        this._messageRepo = messageRepo;
    }

    async execute(consultationId: string, messageIds: string[], userId: string): Promise<void> {
        await this._messageRepo.markDelivered(consultationId, messageIds, userId);
    }
}