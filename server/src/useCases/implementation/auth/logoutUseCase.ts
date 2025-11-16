import { Request, Response } from 'express';
import { ILogoutUseCase } from '@/useCases/interfaces/auth/ILogoutUseCase';
import { appConfig } from '@/infrastructure/config/config';
import { ITokenBlacklistService } from '@/domain/serviceInterface/ITokenBlacklistService';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { authMessages } from '@/shared/constants/messages/authMessages';

export class LogoutUseCase implements ILogoutUseCase {
    private _tokenBlacklistService: ITokenBlacklistService;
    private _tokenService: ITokenService;

    constructor(tokenBlacklistService: ITokenBlacklistService, jwtService: ITokenService) {
        this._tokenBlacklistService = tokenBlacklistService;
        this._tokenService = jwtService;
    }

    async execute(req: Request, res: Response): Promise<void> {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(authMessages.ERROR.NO_TOKEN_PROVIDED, HttpStatus.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];
        let payload: any;

        try {
            payload = this._tokenService.verifyAccessToken(token);
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                // Token is expired; proceed to clear cookies
                payload = null;
            } else {
                throw new AppError(authMessages.ERROR.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
            }
        }

        // If token was valid, blacklist it so it can't be reused
        if (payload && payload.exp) {
            const ttl = payload.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await this._tokenBlacklistService.blacklistToken(token, ttl);
            }
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: appConfig.server.nodeEnv === 'production',
            sameSite: 'strict',
        });
    }
}
