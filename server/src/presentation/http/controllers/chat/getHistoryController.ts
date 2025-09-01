import { NextFunction, Request, Response } from 'express';
import { IGetHistoryUseCase } from '@/useCases/interfaces/chat/IGetHistoryUseCase';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { AppError } from '@/domain/errors/AppError';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetHistoryController {
    private _getHistoryUseCase: IGetHistoryUseCase;

    constructor(getHistoryUseCase: IGetHistoryUseCase) {
        this._getHistoryUseCase = getHistoryUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log('its here in gethistory controller: ', req.params.consultationId);
            if (!req.params.consultationId) {
                throw new AppError(bookingMessages.ERROR.CONSULTATION_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }
            const messages = await this._getHistoryUseCase.execute(req.params.consultationId);
            res.status(HttpStatus.OK).json({
                success: true,
                messages: chatMessages.SUCCESS.HISTORY_FETCHED,
                data: {
                    messages,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}