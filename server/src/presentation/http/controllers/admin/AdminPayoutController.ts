import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { payoutMessages } from '@/shared/constants/messages/payoutMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IApprovePayoutRequest } from '@/useCases/interfaces/payout/IApprovePayoutRequest';
import { IListAllPayoutRequestsUseCase } from '@/useCases/interfaces/payout/IListAllPayoutRequestUseCase';
import { IRejectPayoutRequestUseCase } from '@/useCases/interfaces/payout/IRejectPayoutRequestUsecase';
import { NextFunction, Request, Response } from 'express';

export class AdminPayoutController {
    private _listPayoutRequestUseCase: IListAllPayoutRequestsUseCase;
    private _approvePayoutUseCase: IApprovePayoutRequest;
    private _rejectPayoutUseCase: IRejectPayoutRequestUseCase;

    constructor(
        listPayoutRequestUseCase: IListAllPayoutRequestsUseCase,
        approvePayoutUseCase: IApprovePayoutRequest,
        rejectPayoutUseCase: IRejectPayoutRequestUseCase,
    ) {
        this._listPayoutRequestUseCase = listPayoutRequestUseCase;
        this._approvePayoutUseCase = approvePayoutUseCase;
        this._rejectPayoutUseCase = rejectPayoutUseCase;
    }

    listPayoutRequests = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const requests = await this._listPayoutRequestUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: payoutMessages.SUCCESS.PAYOUTS_FETCHED,
                data: requests,
            });
        } catch (error) {
            next(error);
        }
    };

    approvePayout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { payoutRequestId } = req.params;
            const request = await this._approvePayoutUseCase.execute(payoutRequestId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: payoutMessages.SUCCESS.APPROVED,
                data: request,
            });
        } catch (error) {
            next(error);
        }
    };

    rejectPayout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { payoutRequestId } = req.params;
            const request = await this._rejectPayoutUseCase.execute(payoutRequestId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: payoutMessages.SUCCESS.REJECTED,
                data: request,
            });
        } catch (error) {
            next(error);
        }
    };
}
