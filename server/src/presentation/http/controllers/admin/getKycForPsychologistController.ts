import { Request, Response } from 'express';
import { IGetKycForPsychologistUseCase } from '../../../../useCases/interfaces/admin/management/IGetKycForPsychologistUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class GetKycForPsychologistController {
    constructor(
        private getKycForPsychologistUseCase: IGetKycForPsychologistUseCase,
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const psychologistId = req.params.psychologistId as string;
            console.log('sss: ', psychologistId);
            if (!psychologistId) {
                res.status(404).json({ success: false, message: 'psychologistId is missing' });
                return;
            }

            const kyc = await this.getKycForPsychologistUseCase.execute(psychologistId);

            res.status(200).json(kyc);
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}