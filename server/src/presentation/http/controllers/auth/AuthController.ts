import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { ISignupUseCase } from '@/useCases/interfaces/signup/ISignupUseCase';
import { ILoginUseCase } from '@/useCases/interfaces/auth/ILoginUseCase';
import { ISendOtpUseCase } from '@/useCases/interfaces/signup/ISendOtpUseCase';
import { IVerifyOtpUseCase } from '@/useCases/interfaces/signup/IVerifyOtpUseCase';
import { ILogoutUseCase } from '@/useCases/interfaces/auth/ILogoutUseCase';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { appConfig } from '@/infrastructure/config/config';


export class AuthController {
    private _signupUseCase: ISignupUseCase;
    private _sendOtpUseCase: ISendOtpUseCase;
    private _verifyOtpUseCase: IVerifyOtpUseCase;
    private _loginUseCase: ILoginUseCase;
    private _logoutUseCase: ILogoutUseCase;

    constructor(
        signupUseCase: ISignupUseCase,
        sendOtpUseCase: ISendOtpUseCase,
        verifyOtpUseCase: IVerifyOtpUseCase,
        loginUseCase: ILoginUseCase,
        logoutUseCase: ILogoutUseCase,
    ) {
        this._signupUseCase = signupUseCase;
        this._sendOtpUseCase = sendOtpUseCase;
        this._verifyOtpUseCase = verifyOtpUseCase;
        this._loginUseCase = loginUseCase;
        this._logoutUseCase = logoutUseCase;
    }

    sendOtp = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this._sendOtpUseCase.execute(req.body.email);
            res.status(HttpStatus.OK).json({
                message: authMessages.SUCCESS.OTP_SENT,
            });
            return;
        } catch (error) {
            next(error);
        }
    };

    verifyOtp = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { email, otp, signupToken } = req.body;

            const response = await this._verifyOtpUseCase.execute(
                email,
                otp,
                signupToken,
            );

            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: appConfig.server.nodeEnv === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: userMessages.SUCCESS.REGISTRATION,
                user: response.user,
                accessToken: response.accessToken,
                hasSubmittedVerificationForm: response.hasSubmittedVerificationForm,
            });
        } catch (error) {
            next(error);
        }
    };

    signup = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const file = req.file;

            if (!file) {
                throw new AppError(userMessages.ERROR.PROFILE_IMAGE_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const payload = {
                ...req.body,
                file,
            };

            const signupToken = await this._signupUseCase.execute(payload);

            res.status(HttpStatus.CREATED).json({
                success: true,
                signupToken,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const response = await this._loginUseCase.execute(req.body);

            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                secure: appConfig.server.nodeEnv === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: authMessages.SUCCESS.LOGIN,
                user: response.user,
                accessToken: response.accessToken,
                hasSubmittedVerificationForm: response.hasSubmittedVerificationForm,
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this._logoutUseCase.execute(req, res);

            res.status(HttpStatus.OK).json({
                success: true,
                message: authMessages.SUCCESS.LOGOUT,
            });
        } catch (error) {
            next(error);
        }
    };
}
