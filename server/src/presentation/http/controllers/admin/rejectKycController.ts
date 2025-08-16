import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { IRejectKycUseCase } from '@/useCases/interfaces/admin/management/IRejectKycUseCase';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class RejectKycController {
    private _rejectKycUseCase: IRejectKycUseCase;

    constructor(
        rejectKycUseCase: IRejectKycUseCase,
    ) {
        this._rejectKycUseCase = rejectKycUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const psychologistId = req.params.psychologistId as string;
            const { reason } = req.body;

            if (!reason) {
                throw new AppError(adminMessages.ERROR.KYC_REASON_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            if (!psychologistId) {
                throw new AppError(adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            await this._rejectKycUseCase.execute(psychologistId, reason);
            
            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.KYC_REJECTED,
            });
        } catch (error) {
            next(error);
        }
    };
}