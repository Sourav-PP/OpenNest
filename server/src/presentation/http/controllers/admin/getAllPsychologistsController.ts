import { Request, Response } from 'express';
import { GetAllPsychologistsUseCase } from '../../../../useCases/implementation/admin/management/getAllPsychologistsUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class GetAllPsychologistController {
    constructor(private getAllPsychologistsUseCase: GetAllPsychologistsUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const { search, sort, gender } = req.query;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this.getAllPsychologistsUseCase.execute({
                search: search as string,
                sort: sort as 'asc' | 'desc',
                gender: gender as 'Male' | 'Female',
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