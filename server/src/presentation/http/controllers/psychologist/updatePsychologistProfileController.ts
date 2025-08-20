import { NextFunction, Request, Response } from 'express';
import { IUpdatePsychologistProfileUseCase } from '@/useCases/interfaces/psychologist/profile/IUpdatePsychologistProfileUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { userMessages } from '@/shared/constants/messages/userMessages';

export class UpdatePsychologistProfileController {
    private _updatePsychologistUseCase: IUpdatePsychologistProfileUseCase;

    constructor(updatePsychologistUseCase: IUpdatePsychologistProfileUseCase) {
        this._updatePsychologistUseCase = updatePsychologistUseCase;
    }

    handle = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
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
