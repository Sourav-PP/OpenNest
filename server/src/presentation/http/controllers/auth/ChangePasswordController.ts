import { NextFunction, Request, Response } from 'express';
import { IChangePasswordUseCase } from '@/useCases/interfaces/auth/IChangePasswordUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class ChangePasswordController {
    private _changePasswordUseCase: IChangePasswordUseCase;

    constructor(changePasswordUseCase: IChangePasswordUseCase) {
        this._changePasswordUseCase = changePasswordUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._changePasswordUseCase.execute(userId, currentPassword, newPassword);

            res.status(HttpStatus.OK).json({
                success: true,
                message: authMessages.SUCCESS.PASSWORD_RESET,
            });
        } catch (error) {
            next(error);
        }
    };
}
