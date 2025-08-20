import { NextFunction, Request, Response } from 'express';
import { IGetUserProfileUseCase } from '@/useCases/interfaces/user/profile/IGetUserProfileUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';

export class GetUserProfileController {
    private _getUserProfile: IGetUserProfileUseCase;

    constructor(getUserProfile: IGetUserProfileUseCase) {
        this._getUserProfile = getUserProfile;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.user?.userId;
            if (!id) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            const userProfile = await this._getUserProfile.execute({ userId: id });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_USER_PROFILE,
                data: userProfile,
            });
        } catch (error) {
            next(error);
        }
    };
}