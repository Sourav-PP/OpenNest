import { Request, Response, NextFunction } from 'express';  
import { IAdminService } from '@/domain/serviceInterface/IAdminService';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IGetRevenueStatsUseCase } from '@/useCases/interfaces/admin/management/IGetRevenueStatsUseCase';

export class AdminDashboardController {
    private _adminService: IAdminService;
    private _getRevenueStatusUseCase: IGetRevenueStatsUseCase;

    constructor(
        adminService: IAdminService,
        getRevenueStatsUseCase: IGetRevenueStatsUseCase,
    ) {
        this._adminService = adminService;
        this._getRevenueStatusUseCase = getRevenueStatsUseCase;
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
}