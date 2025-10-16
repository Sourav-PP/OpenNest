import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IResetPasswordUseCase } from '@/useCases/interfaces/auth/IResetPasswordUseCase';
import { IVerifyForgotPasswordUseCase } from '@/useCases/interfaces/auth/IVerifyForgotPasswordUseCase';
import { Request, Response, NextFunction } from 'express';

export class ForgotPasswordController {
    private _verifyForgotPasswordOtpUseCase: IVerifyForgotPasswordUseCase;
    private _resetPasswordUseCase: IResetPasswordUseCase;

    constructor(
        verifyForgotPasswordUseCase: IVerifyForgotPasswordUseCase,
        resetPasswordUseCase: IResetPasswordUseCase,
    ) {
        this._resetPasswordUseCase = resetPasswordUseCase;
        this._verifyForgotPasswordOtpUseCase = verifyForgotPasswordUseCase;
    }

    verifyOtp = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp } = req.body;
            const verified = await this._verifyForgotPasswordOtpUseCase.execute(email, otp);

            if (!verified) {
                throw new AppError(authMessages.ERROR.INVALID_OTP);
            }

            res.status(HttpStatus.OK).json({
                success: true,
                message: authMessages.SUCCESS.OTP_VERIFIED,
            });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            await this._resetPasswordUseCase.execute(email, password);

            res.status(HttpStatus.OK).json({
                success: true,
                message: authMessages.SUCCESS.PASSWORD_RESET,
            });
        } catch (error) {
            next(error);
        }
    };
}
