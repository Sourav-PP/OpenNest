import { AppError } from '@/domain/errors/AppError';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IUploadChatMediaUseCase } from '@/useCases/interfaces/chat/IUploadChatMediaUseCase';
import { NextFunction, Request, Response } from 'express';

export class ChatFileController {
    private _uploadChatMediaUseCase: IUploadChatMediaUseCase;

    constructor(uploadChatMediaUseCase: IUploadChatMediaUseCase) {
        this._uploadChatMediaUseCase = uploadChatMediaUseCase;
    }

    uploadMedia = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            console.log('its here: ', req.file);
            if (!req.file) {
                throw new AppError(
                    chatMessages.ERROR.NO_FILE_PROVIDED,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const { mediaUrl, mediaType } =
                await this._uploadChatMediaUseCase.execute(req.file);

            res.status(HttpStatus.OK).json({
                success: true,
                message: chatMessages.SUCCESS.FILE_UPLOADED,
                data: {
                    mediaUrl,
                    mediaType,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}
