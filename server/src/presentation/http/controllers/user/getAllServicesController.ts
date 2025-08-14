import { Request, Response } from 'express';
import { GetAllServiceUseCase } from '../../../../useCases/implementation/user/data/getAllServicesUseCase';
import { AppError } from '../../../../domain/errors/AppError';
import { IGetAllServiceInput } from '../../../../useCases/types/serviceTypes';

export class GetAllServicesController {
    constructor(private getAllServicesUseCase: GetAllServiceUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const input: IGetAllServiceInput = {
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
            };
            const output = await this.getAllServicesUseCase.execute(input);
            res.status(200).json(output);
            return;
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}