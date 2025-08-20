import { NextFunction, Request, Response } from 'express';
import { IGetProfileUseCase } from '@/useCases/interfaces/psychologist/profile/IGetProfileUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetProfileController {
    private _getProfileUseCase: IGetProfileUseCase;

    constructor(getProfileUseCase: IGetProfileUseCase) {
        this._getProfileUseCase = getProfileUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const data = await this._getProfileUseCase.execute(userId);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            next(error);
        }
    };
}