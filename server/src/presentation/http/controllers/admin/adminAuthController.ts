import { NextFunction, Request, Response } from 'express';
import { IAdminLoginUseCase } from '@/useCases/interfaces/admin/auth/ILoginUseCase';
import { IAdminLogoutUseCase } from '@/useCases/interfaces/admin/auth/ILogoutUseCase';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { appConfig } from '@/infrastructure/config/config';

export class AdminAuthController {
    private _adminLoginUseCase: IAdminLoginUseCase;
    private _adminLogoutUseCase: IAdminLogoutUseCase;

    constructor(adminLoginUseCase: IAdminLoginUseCase, adminLogoutUseCase: IAdminLogoutUseCase) {
        this._adminLoginUseCase = adminLoginUseCase;
        this._adminLogoutUseCase = adminLogoutUseCase;
    }

    login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this._adminLoginUseCase.execute({ email, password });

            res.cookie('adminRefreshToken', refreshToken, {
                httpOnly: true,
                secure: appConfig.server.nodeEnv === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: authMessages.SUCCESS.LOGIN,
                accessToken,
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this._adminLogoutUseCase.execute(req, res);
            res.status(HttpStatus.OK).json({
                success: true,
                message: authMessages.SUCCESS.LOGOUT,
            });
        } catch (error) {
            next(error);
        }
    };
}
