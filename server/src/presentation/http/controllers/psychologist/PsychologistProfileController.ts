import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetProfileUseCase } from '@/useCases/interfaces/psychologist/profile/IGetProfileUseCase';
import { IUpdatePsychologistProfileUseCase } from '@/useCases/interfaces/psychologist/profile/IUpdatePsychologistProfileUseCase';
import { NextFunction, Request, Response } from 'express';

export class PsychologistProfileController {
    private _getProfileUseCase: IGetProfileUseCase;
    private _updatePsychologistUseCase: IUpdatePsychologistProfileUseCase;

    constructor(getProfileUseCase: IGetProfileUseCase, updatePsychologistUseCase: IUpdatePsychologistProfileUseCase) {
        this._getProfileUseCase = getProfileUseCase;
        this._updatePsychologistUseCase = updatePsychologistUseCase;
    }

    getProfile = async(req: Request, res: Response, next: NextFunction) => {
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

    updateProfile = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const payload = {
                userId,
                ...req.body,
                file: req.file,
            };

            await this._updatePsychologistUseCase.execute(payload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: userMessages.SUCCESS.PROFILE_UPDATE,
            });
        } catch (error) {
            next(error);
        }
    };
}
