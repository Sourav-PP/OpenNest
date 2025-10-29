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

        const payload = this._tokenService.verifyAccessToken(token);
        if (!payload || !payload.userId || !payload.email || !payload.role) {
            throw new AppError(authMessages.ERROR.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
        }
        const exp = payload.exp;
        const ttl = exp - Math.floor(Date.now() / 1000);

        if (ttl > 0) {
            await this._tokenBlacklistService.blacklistToken(token, ttl);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: appConfig.server.nodeEnv === 'production',
            sameSite: 'strict',
        });
    }
}
