import { Request, Response } from 'express';
import { GetProfileUseCase } from '../../../../useCases/implementation/psychologist/profile/getProfileUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class GetProfileController {
    constructor(private getProfileUseCase: GetProfileUseCase) {}

    handle = async(req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success:false, message: 'Unauthorized user' });
                return;
            }

            const data = await this.getProfileUseCase.execute(userId);
            res.status(200).json(data);
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}