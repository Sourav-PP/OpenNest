import { Message } from '@/domain/entities/message';
import { AppError } from '@/domain/errors/AppError';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IDeleteMessageUseCase } from '@/useCases/interfaces/chat/IDeleteMessageUseCase';

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
    private _messageRepo: IMessageRepository;

    constructor(messageRepo: IMessageRepository) {
        this._messageRepo = messageRepo;
    }

    async execute(messageId: string, deletedBy: string): Promise<Message> {
        const message = await this._messageRepo.findById(messageId);

        if (!message) {
            throw new AppError(chatMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (message.deleted) {
            throw new AppError(chatMessages.ERROR.ALREADY_DELETED, HttpStatus.BAD_REQUEST); 
        }

        const updatedMessage = await this._messageRepo.updateById(messageId, {
            deleted: true,
            updatedAt: new Date(),
            deletedBy,
        });

        if (!updatedMessage) {
            throw new AppError(generalMessages.ERROR.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return updatedMessage;
    }
}
