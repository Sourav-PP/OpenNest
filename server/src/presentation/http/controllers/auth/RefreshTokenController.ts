import { NextFunction, Request, Response } from 'express';
import { IRefreshTokenUseCase } from '@/useCases/interfaces/auth/IRefreshTokenUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class RefreshTokenController {
    private _refreshTokenUseCase: IRefreshTokenUseCase;
    private _cookieKey: string;

    constructor(refreshTokenUseCase: IRefreshTokenUseCase, cookieKey: string) {
        this._refreshTokenUseCase = refreshTokenUseCase;
        this._cookieKey = cookieKey;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const refreshToken = req.cookies?.[this._cookieKey];
            if (!refreshToken) {
                throw new AppError(authMessages.ERROR.REFRESH_TOKEN_REQUIRED, HttpStatus.UNAUTHORIZED);
            }

            const accessToken = await this._refreshTokenUseCase.execute(refreshToken);

            res.status(HttpStatus.OK).json({
                success: true,
                accessToken,
            });
        } catch (error) {
            next(error);
        }
    };
}
