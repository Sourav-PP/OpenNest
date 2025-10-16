import { Request, Response } from 'express';
import { ILogoutUseCase } from '@/useCases/interfaces/auth/ILogoutUseCase';
import { appConfig } from '@/infrastructure/config/config';

export class LogoutUseCase implements ILogoutUseCase {
    async execute(req: Request, res: Response): Promise<void> {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: appConfig.server.nodeEnv === 'production',
            sameSite: 'strict',
        });
    }
}
