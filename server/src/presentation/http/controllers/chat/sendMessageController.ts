import { NextFunction, Request, Response } from 'express';
import { ISendMessageUseCase } from '@/useCases/interfaces/chat/ISendMessageUseCase';
import { chatMessages } from '@/shared/constants/messages/chatMessages';

export class SendMessageController {
    private _sendMessageUseCase: ISendMessageUseCase;

    constructor(sendMessageUseCase: ISendMessageUseCase) {
        this._sendMessageUseCase = sendMessageUseCase;
    }

    handle = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const message = await this._sendMessageUseCase.execute(req.body);
            res.status(200).json({
                success: true,
                message: chatMessages.SUCCESS.SENT,
                data: message,
            });
        } catch (error) {
            next(error);
        }
    };
}
