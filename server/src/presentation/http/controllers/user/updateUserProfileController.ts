import { NextFunction, Request, Response } from 'express';
import { IUpdateUserProfileUseCase } from '@/useCases/interfaces/user/profile/IUpdateUserProfileUseCase';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';

export class UpdateUserProfileController {
    private _updateUserProfileUseCase: IUpdateUserProfileUseCase;

    constructor(updateUserProfileUseCase: IUpdateUserProfileUseCase) {
        this._updateUserProfileUseCase = updateUserProfileUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { name, email, phone, gender, dateOfBirth } = req.body;

            const updatedUser = await this._updateUserProfileUseCase.execute({
                userId,
                name,
                email,
                phone,
                dateOfBirth,
                gender,
                file: req.file,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: userMessages.SUCCESS.PROFILE_UPDATE,
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    };
}