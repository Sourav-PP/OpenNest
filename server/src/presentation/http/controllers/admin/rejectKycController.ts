import { Request, Response } from 'express';
import { AppError } from '../../../../domain/errors/AppError';
import { IRejectKycUseCase } from '../../../../useCases/interfaces/admin/management/IRejectKycUseCase';

export class RejectKycController {
    constructor(
        private rejectKycUseCase: IRejectKycUseCase,
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const psychologistId = req.params.psychologistId as string;
            const { reason } = req.body;

            if (!reason) {
                res.status(404).json({ success: false, message: 'Reason is required to reject the kyc.' });
                return;
            }

            if (!psychologistId) {
                res.status(400).json({ success: false, message: 'psychologist id is required' });
                return;
            }

            await this.rejectKycUseCase.execute(psychologistId, reason);
            res.status(200).json({ message: 'KYC rejected successfully' });
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}