import { NextFunction, Request, Response } from 'express';
import { IApproveKycUseCase } from '@/useCases/interfaces/admin/management/IApproveKycUseCase';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';

export class ApproveKycController {
    private _approveKycUseCase: IApproveKycUseCase;

    constructor(approveKycUseCase: IApproveKycUseCase) {
        this._approveKycUseCase = approveKycUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const psychologistId = req.params.psychologistId as string;

            if (!psychologistId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED,
                });
                return;
            }

            await this._approveKycUseCase.execute(psychologistId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.KYC_APPROVED,
            });
        } catch (error) {
            next(error);
        }
    };
}
