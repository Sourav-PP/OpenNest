import { Request, Response } from 'express';
import { IGetAllKycUseCase } from '../../../../useCases/interfaces/admin/management/IGetAllKycUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class GetAllKycController {
    constructor(
        private getAllKycUseCase: IGetAllKycUseCase,
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            console.log('page: ', page);

            const result = await this.getAllKycUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                status: req.query.status as 'pending' | 'approved' | 'rejected' | 'all',
                page,
                limit,
            });
            res.status(200).json(result);
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}