import { NextFunction, Request, Response } from 'express';
import { IGetSlotByPsychologistUseCase } from '@/useCases/interfaces/psychologist/availability/IGetSlotByPsychologistUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetSlotByPsychologistController {
    private _getSlotByPsychologistUseCase: IGetSlotByPsychologistUseCase;

    constructor(
        getSlotByPsychologistUseCase: IGetSlotByPsychologistUseCase,
    ) {
        this._getSlotByPsychologistUseCase = getSlotByPsychologistUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const slots = await this._getSlotByPsychologistUseCase.execute(userId);
            res.status(HttpStatus.OK).json(slots);
        } catch (error) {
            next(error);
        }
    };
}