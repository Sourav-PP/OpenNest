import { Request, Response } from 'express';
import { GetPsychologistDetailsUseCase } from '../../../../useCases/implementation/user/data/getPsychologistDetails';
import { AppError } from '../../../../domain/errors/AppError';

export class GetPsychologistDetailsController {
    constructor(private getPsychologistDetails: GetPsychologistDetailsUseCase) {}

    handle = async(req: Request, res: Response) => {
        try {
            const userId = req.params.id;

            const data = await this.getPsychologistDetails.execute(userId);
            res.status(200).json(data);
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}