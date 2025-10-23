import { ConsultationStatusFilter } from '@/domain/enums/ConsultationEnums';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { sessionMessages } from '@/shared/constants/messages/sessionMessages';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICancelConsultationUseCase } from '@/useCases/interfaces/user/data/ICancelConsultationUseCase';
import { IGetUserConsultationByIdUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationByIdUseCase';
import { IGetUserConsultationHistoryDetailsUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationHistoryDetailsUseCase';
import { IGetUserConsultationHistoryUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationHistoryUseCase';
import { IGetUserConsultationUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationsUseCase';
import { IUpdateConsultationRatingUseCase } from '@/useCases/interfaces/user/data/IUpdateConsultationRatingUseCase';
import { NextFunction, Request, Response } from 'express';

export class UserConsultationController {
    private _getUserConsultationsUseCase: IGetUserConsultationUseCase;
    private _getUserConsultationByIdUseCase: IGetUserConsultationByIdUseCase;
    private _cancelConsultationUseCase: ICancelConsultationUseCase;
    private _getUserConsultationHistoryUseCase: IGetUserConsultationHistoryUseCase;
    private _getUserConsultationHistoryDetailsUseCase: IGetUserConsultationHistoryDetailsUseCase;
    private _updateConsultationRatingUseCase: IUpdateConsultationRatingUseCase;

    constructor(
        getUserConsultationsUseCase: IGetUserConsultationUseCase,
        getUserConsultationByIdUseCase: IGetUserConsultationByIdUseCase,
        cancelConsultationUseCase: ICancelConsultationUseCase,
        getUserConsultationHistoryUseCase: IGetUserConsultationHistoryUseCase,
        getUserConsultationHistoryDetailsUseCase: IGetUserConsultationHistoryDetailsUseCase,
        updateConsultationRatingUseCase: IUpdateConsultationRatingUseCase,
    ) {
        this._getUserConsultationsUseCase = getUserConsultationsUseCase;
        this._getUserConsultationByIdUseCase = getUserConsultationByIdUseCase;
        this._cancelConsultationUseCase = cancelConsultationUseCase;
        this._getUserConsultationHistoryUseCase = getUserConsultationHistoryUseCase;
        this._getUserConsultationHistoryDetailsUseCase = getUserConsultationHistoryDetailsUseCase;
        this._updateConsultationRatingUseCase = updateConsultationRatingUseCase;
    }

    getConsultations = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const result = await this._getUserConsultationsUseCase.execute({
                patientId: userId,
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                status: req.query.status as ConsultationStatusFilter,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getConsultationDetail = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { consultationId } = req.params;
            const result = await this._getUserConsultationByIdUseCase.execute(consultationId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    cancelConsultation = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { consultationId } = req.params;
            const { reason } = req.body;

            const consultation = await this._cancelConsultationUseCase.execute(userId, consultationId, reason);

            res.status(HttpStatus.OK).json({
                success: true,
                message: sessionMessages.SUCCESS.CANCELLED,
                data: consultation,
            });
        } catch (error) {
            next(error);
        }
    };

    getHistory = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const result = await this._getUserConsultationHistoryUseCase.execute({
                patientId: userId,
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getHistoryDetails = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { consultationId } = req.params;
            const result = await this._getUserConsultationHistoryDetailsUseCase.execute(consultationId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    updateRating = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            
            const { consultationId } = req.params;
            const { rating, userFeedback } = req.body;

            await this._updateConsultationRatingUseCase.execute({
                userId,
                consultationId,
                rating,
                userFeedback,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: userMessages.SUCCESS.RATING_SUBMITTED,
            });
        } catch (error) {
            next(error);
        }
    };
}
