import { Request, Response } from 'express';
import { AppError } from '../../../../domain/errors/AppError';
import { IApproveKycUseCase } from '../../../../useCases/interfaces/admin/management/IApproveKycUseCase';

export class ApproveKycController {
    constructor(
        private approveKycUseCase: IApproveKycUseCase,
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const psychologistId = req.params.psychologistId as string;

            if (!psychologistId) {
                res.status(400).json({ success: false, message: 'psychologist id is required' });
                return;
            }

            await this.approveKycUseCase.execute(psychologistId);
            res.status(200).json({ message: 'KYC approved successfully' });
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}