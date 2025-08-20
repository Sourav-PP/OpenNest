import { NextFunction, Request, Response } from 'express';
import { IDeleteSlotUseCase } from '@/useCases/interfaces/psychologist/availability/IDeleteSlotUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class DeleteSlotController {
    private _deleteSlotUseCase: IDeleteSlotUseCase;

    constructor(
        deleteSlotUseCase: IDeleteSlotUseCase,
    ) {
        this._deleteSlotUseCase = deleteSlotUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { slotId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }           

            await this._deleteSlotUseCase.execute({ slotId, userId });

            res.status(HttpStatus.OK).json({
                success: true,
                message: psychologistMessages.SUCCESS.SLOT_DELETED,
            });
        } catch (error) {
            next(error);
        }
    };
}
