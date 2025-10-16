import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetUserProfileUseCase } from '@/useCases/interfaces/user/profile/IGetUserProfileUseCase';
import { IUpdateUserProfileUseCase } from '@/useCases/interfaces/user/profile/IUpdateUserProfileUseCase';
import { NextFunction, Request, Response } from 'express';

export class UserProfileController {
    private _getUserProfile: IGetUserProfileUseCase;
    private _updateUserProfileUseCase: IUpdateUserProfileUseCase;

    constructor(getUserProfile: IGetUserProfileUseCase, updateUserProfileUseCase: IUpdateUserProfileUseCase) {
        this._getUserProfile = getUserProfile;
        this._updateUserProfileUseCase = updateUserProfileUseCase;
    }

    getProfile = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            const userProfile = await this._getUserProfile.execute({ userId });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_USER_PROFILE,
                data: userProfile,
            });
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
