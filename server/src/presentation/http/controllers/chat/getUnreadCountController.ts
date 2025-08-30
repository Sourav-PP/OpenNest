import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetUnreadCountUseCase } from '@/useCases/interfaces/chat/IGetUnreadCountUseCase';
import { NextFunction, Request, Response } from 'express';

export class GetUnreadCountController {
    private _getUnreadCountUseCase: IGetUnreadCountUseCase;

    constructor(getUnreadCountUseCase: IGetUnreadCountUseCase) {
        this._getUnreadCountUseCase = getUnreadCountUseCase;
    }

    handle = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const { consultationId } = req.params;

            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const count = await this._getUnreadCountUseCase.execute(consultationId, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: chatMessages.SUCCESS.UNREAD_COUNT_FETCHED,
                data: count,
            });
        } catch (error) {
            next(error);
        }
    };
}
