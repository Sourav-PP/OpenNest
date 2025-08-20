import { NextFunction, Request, Response } from 'express';
import { IGoogleLoginUseCase } from '@/useCases/interfaces/auth/IGoogleLoginUseCase';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { appConfig } from '@/infrastructure/config/config';

export class GoogleLoginController {
    private _googleLoginUseCase: IGoogleLoginUseCase;

    constructor(
        googleLoginUseCase: IGoogleLoginUseCase,
    ) {
        this._googleLoginUseCase = googleLoginUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { credential, role } = req.body;

            const result = await this._googleLoginUseCase.execute({ credential, role });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: appConfig.server.nodeEnv === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(HttpStatus.OK).json({
                success: true,
                message: authMessages.SUCCESS.LOGIN,
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                    hasSubmittedVerificationForm: result.hasSubmittedVerificationForm,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}