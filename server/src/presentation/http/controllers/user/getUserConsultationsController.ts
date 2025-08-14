import { Request, Response } from 'express';
import { AppError } from '../../../../domain/errors/AppError';
import { IGetUserConsultationUseCase } from '../../../../useCases/interfaces/user/data/IGetUserConsultationsUseCase';

export class GetUserConsultationsController {
    constructor(
        private getUserConsultationsUseCase: IGetUserConsultationUseCase,
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                res.status(401).json({ success: false, message:'user is unauthorized' });
                return;
            }

            const result = await this.getUserConsultationsUseCase.execute({
                patientId: userId,
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                status: req.query.staus as 'booked' | 'cancelled' | 'completed' | 'rescheduled',
                page,
                limit,
            });

            console.log('result of getuserconsultation: ', result);
            res.status(200).json(result);
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}