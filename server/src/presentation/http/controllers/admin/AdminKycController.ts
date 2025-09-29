import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IApproveKycUseCase } from '@/useCases/interfaces/admin/management/IApproveKycUseCase';
import { IGetAllKycUseCase } from '@/useCases/interfaces/admin/management/IGetAllKycUseCase';
import { IGetKycForPsychologistUseCase } from '@/useCases/interfaces/admin/management/IGetKycForPsychologistUseCase';
import { IRejectKycUseCase } from '@/useCases/interfaces/admin/management/IRejectKycUseCase';
import { NextFunction, Request, Response } from 'express';

export class AdminKycController {
    private _getAllKycUseCase: IGetAllKycUseCase;
    private _getKycForPsychologistUseCase: IGetKycForPsychologistUseCase;
    private _approveKycUseCase: IApproveKycUseCase;
    private _rejectKycUseCase: IRejectKycUseCase;

    constructor(
        getAllKycUseCase: IGetAllKycUseCase,
        getKycForPsychologistUseCase: IGetKycForPsychologistUseCase,
        approveKycUseCase: IApproveKycUseCase,
        rejectKycUseCase: IRejectKycUseCase,
      
    ) {
        this._getAllKycUseCase = getAllKycUseCase;
        this._getKycForPsychologistUseCase = getKycForPsychologistUseCase;
        this._approveKycUseCase = approveKycUseCase;
        this._rejectKycUseCase = rejectKycUseCase;
    }

    getAllKyc = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllKycUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                status: req.query.status as
                    | 'pending'
                    | 'approved'
                    | 'rejected'
                    | 'all',
                page,
                limit,
            });

            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    };

    getKycForPsychologist = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const psychologistId = req.params.psychologistId as string;
    
            if (!psychologistId) {
                throw new AppError( adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const kyc = await this._getKycForPsychologistUseCase.execute(psychologistId);

            res.status(HttpStatus.OK).json(kyc);
        } catch (error) {
            next(error);
        }
    };

    approveKyc = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    rejectKyc = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
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
