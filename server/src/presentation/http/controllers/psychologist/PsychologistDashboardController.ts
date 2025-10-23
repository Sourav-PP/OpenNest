import { Request, Response, NextFunction } from 'express';  
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IGetPsychologistRevenueStatsUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistRevenueStatsUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { IGetTopUsersUseCase } from '@/useCases/interfaces/psychologist/data/IGetTopUsersUseCase';
import { IGetTopRatedConsultationsUseCase } from '@/useCases/interfaces/psychologist/data/IGetTopRatedConsultationsUseCase';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { IGetPsychologistTotalsUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistTotalsUseCase';

export class PsychologistDashboardController {
    private _getPsychologistRevenueStatusUseCase: IGetPsychologistRevenueStatsUseCase;
    private _getTopUsersUseCase: IGetTopUsersUseCase;
    private _getTopRatedConsultations: IGetTopRatedConsultationsUseCase;
    private _getTotalsUseCase: IGetPsychologistTotalsUseCase;

    constructor(
        getPsychologistRevenueStatusUseCase: IGetPsychologistRevenueStatsUseCase,
        getTopUsersUseCase: IGetTopUsersUseCase,
        getTopRatedConsultations: IGetTopRatedConsultationsUseCase,
        getTotalsUseCase: IGetPsychologistTotalsUseCase,
    ) {
        this._getPsychologistRevenueStatusUseCase = getPsychologistRevenueStatusUseCase;
        this._getTopUsersUseCase = getTopUsersUseCase;
        this._getTopRatedConsultations = getTopRatedConsultations;
        this._getTotalsUseCase = getTotalsUseCase;
    }

    getRevenueStats = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

            const filter = (req.query.filter as RevenueFilter) || RevenueFilter.MONTHLY;
            const result = await this._getPsychologistRevenueStatusUseCase.execute(userId, filter);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.STATS_FETCHED,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getTopUsers = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

            const limit = Number(req.query.limit) || 5;

            const topUsers = await this._getTopUsersUseCase.execute(userId, limit);

            res.status(HttpStatus.OK).json({
                success: true,
                message: psychologistMessages.SUCCESS.FETCHED_TOP_USERS,
                data: topUsers,
            });
        } catch (error) {
            next(error);
        }
    };

    getTopRatedConsultations = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

            const limit = Number(req.query.limit) || 5;

            const topConsultations = await this._getTopRatedConsultations.execute(userId, limit);

            res.status(HttpStatus.OK).json({
                success: true,
                message: psychologistMessages.SUCCESS.FETCHED_TOP_RATED_CONSULTATIONS,
                data: topConsultations,
            });
        } catch (error) {
            next(error);
        }
    };

    getTotals = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

            const result = await this._getTotalsUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: psychologistMessages.SUCCESS.FETCHED_TOTALS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}