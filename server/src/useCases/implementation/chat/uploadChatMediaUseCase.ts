import { AppError } from '@/domain/errors/AppError';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IUploadChatMediaUseCase } from '@/useCases/interfaces/chat/IUploadChatMediaUseCase';
import { IChatFileStorage } from '@/useCases/interfaces/IChatFileStorage';

export class UploadChatMediaUseCase implements IUploadChatMediaUseCase {
    private _chatFileStorage: IChatFileStorage;

    constructor(chatFileStorage: IChatFileStorage) {
        this._chatFileStorage = chatFileStorage;
    }

    async execute(file: Express.Multer.File): Promise<{ mediaUrl: string; mediaType: string }> {
        if (!file) {
            throw new AppError(chatMessages.ERROR.NO_FILE_PROVIDED, HttpStatus.BAD_REQUEST);
        }

        const { url, type } = await this._chatFileStorage.upload(file.buffer, file.originalname, 'chat-media');

        const ext = file.originalname.split('.').pop()?.toLowerCase();

        let mediaType: string;
        if (type === 'image') mediaType = 'image';
        else if (type === 'video') {
            if (ext && ['mp3', 'ogg', 'wav', 'm4a', 'aac'].includes(ext)) mediaType = 'audio';
            else mediaType = 'video';
        } else if (type === 'audio') mediaType = 'audio';
        else mediaType = 'file';

        return { mediaUrl: url, mediaType };
    }
}
