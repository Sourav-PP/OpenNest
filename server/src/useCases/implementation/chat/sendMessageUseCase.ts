import { ISendMessageUseCase } from '@/useCases/interfaces/chat/ISendMessageUseCase';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import { Message } from '@/domain/entities/message';
import { ISendMessageInput } from '@/useCases/types/chatTypes';
import { AppError } from '@/domain/errors/AppError';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IEnsureMembershipUseCase } from '@/useCases/interfaces/chat/IEnsureMembershipUseCase';

export class SendMessageUseCase implements ISendMessageUseCase {
    private _messageRepo: IMessageRepository;
    private _ensureMembershipUseCase: IEnsureMembershipUseCase;

    constructor(messageRepo: IMessageRepository, ensureMembershipUseCase: IEnsureMembershipUseCase) {
        this._messageRepo = messageRepo;
        this._ensureMembershipUseCase = ensureMembershipUseCase;
    }

    async execute(data: ISendMessageInput): Promise<Message> {
        if (!data.content && !data.mediaUrl) {
            throw new AppError(chatMessages.ERROR.EMPTY_MESSAGE, HttpStatus.BAD_REQUEST);
        }

        if (data.mediaUrl && !data.mediaType) {
            throw new AppError(chatMessages.ERROR.EMPTY_MESSAGE, HttpStatus.BAD_REQUEST);
        }

        // Ensuring weather sender is part of the consultation or not
        await this._ensureMembershipUseCase.execute(data.senderId, data.roomId);
        return await this._messageRepo.create(data);
    }
}
