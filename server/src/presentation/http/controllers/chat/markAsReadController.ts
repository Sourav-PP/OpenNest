import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IMarkReadUseCase } from '@/useCases/interfaces/chat/IMarkReadUseCase';
import { Request, Response, NextFunction } from 'express';

export class MarkAsReadController {
    private _markAsReadUseCase: IMarkReadUseCase;

    constructor(markAsReadUseCase: IMarkReadUseCase) {
        this._markAsReadUseCase = markAsReadUseCase;
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

            await this._markAsReadUseCase.execute(consultationId, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: chatMessages.SUCCESS.MARKED_AS_READ,
            });
        } catch (error) {
            next(error);
        }
    };
}
