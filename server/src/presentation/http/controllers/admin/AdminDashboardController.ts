import { Request, Response, NextFunction } from 'express';  
import { IAdminService } from '@/domain/serviceInterface/IAdminService';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IGetRevenueStatsUseCase } from '@/useCases/interfaces/admin/management/IGetRevenueStatsUseCase';
import { IGetUserTrendUseCase } from '@/useCases/interfaces/admin/management/IGetUserTrendUseCase';
import { IGetBookingTrendUseCase } from '@/useCases/interfaces/admin/management/IGetBookingTrendUseCase';

export class AdminDashboardController {
    private _adminService: IAdminService;
    private _getRevenueStatusUseCase: IGetRevenueStatsUseCase;
    private _getUserTrendUseCase: IGetUserTrendUseCase;
    private _getBookingTrendUseCase: IGetBookingTrendUseCase;

    constructor(
        adminService: IAdminService,
        getRevenueStatsUseCase: IGetRevenueStatsUseCase,
        getUserTrendUseCase: IGetUserTrendUseCase,
        getBookingTrendUseCase: IGetBookingTrendUseCase,
    ) {
        this._adminService = adminService;
        this._getRevenueStatusUseCase = getRevenueStatsUseCase;
        this._getUserTrendUseCase = getUserTrendUseCase;
        this._getBookingTrendUseCase = getBookingTrendUseCase;
    }

    getDashboardTotals = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const totals = await this._adminService.getTotals();

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_DASHBOARD_TOTALS,
                data: totals,
            });
        } catch (error) {
            next(error);
        }
    };

    getRevenueStats = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = (req.query.filter as RevenueFilter) || RevenueFilter.MONTHLY;
            const result = await this._getRevenueStatusUseCase.execute(filter);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.STATS_FETCHED,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getUserTrend = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = (req.query.filter as RevenueFilter) || RevenueFilter.MONTHLY;
            const result = await this._getUserTrendUseCase.execute(filter);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.USER_TREND_FETCHED,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getBookingTrend = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = (req.query.filter as RevenueFilter) || RevenueFilter.MONTHLY;
            const result = await this._getBookingTrendUseCase.execute(filter);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.BOOKING_TREND_FETCHED,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}