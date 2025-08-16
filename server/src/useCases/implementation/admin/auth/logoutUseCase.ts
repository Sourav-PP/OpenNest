import { Request, Response } from 'express';
import { IAdminLogoutUseCase } from '@/useCases/interfaces/admin/auth/ILogoutUseCase';
import { appConfig } from '@/infrastructure/config/config';

export class AdminLogoutUseCase implements IAdminLogoutUseCase {
    async execute(req: Request, res: Response): Promise<void> {
        res.clearCookie('adminRefreshToken', {
            httpOnly: true,
            secure: appConfig.server.nodeEnv === 'production',
            sameSite: 'strict',
        });
    }
}