import { Request, Response } from 'express';
import { RefreshTokenUseCase } from '../../../../useCases/implementation/auth/refreshTokenUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class RefreshTokenController {
    constructor(
    private refreshTokenUseCase: RefreshTokenUseCase,
    private cookieKey: string,
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.cookies?.[this.cookieKey];
            if (!refreshToken) {
                res.status(401).json({ message: 'No refresh token' });
                return;
            }

            const accessToken = await this.refreshTokenUseCase.execute(refreshToken);
            res.status(200).json({ accessToken });
            return;
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}
