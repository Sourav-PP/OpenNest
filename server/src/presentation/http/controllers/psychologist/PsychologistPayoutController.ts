import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { payoutMessages } from '@/shared/constants/messages/payoutMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPendingAmountUseCase } from '@/useCases/interfaces/payout/IGetPendingAmountUseCase';
import { IListPayoutRequestsByPsychologistUseCase } from '@/useCases/interfaces/payout/IListPayoutRequestsByPsychologistUseCase';
import { IRequestPayoutUseCase } from '@/useCases/interfaces/payout/IRequestPayoutUseCase';
import { NextFunction, Request, Response } from 'express';

export class PsychologistPayoutController {
    private _requestPayoutUseCase: IRequestPayoutUseCase;
    private _listPayoutRequestUseCase: IListPayoutRequestsByPsychologistUseCase;
    private _getPendingAmountUseCase: IGetPendingAmountUseCase;

    constructor(
        requestPayoutUseCase: IRequestPayoutUseCase,
        listPayoutRequestUseCase: IListPayoutRequestsByPsychologistUseCase,
        getPendingAmountUseCase: IGetPendingAmountUseCase,
    ) {
        this._requestPayoutUseCase = requestPayoutUseCase;
        this._listPayoutRequestUseCase = listPayoutRequestUseCase;
        this._getPendingAmountUseCase = getPendingAmountUseCase;
    }

    getPendingAmount = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

            const pending = await this._getPendingAmountUseCase.execute(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: payoutMessages.SUCCESS.FETCHED_PENDING_AMOUNT,
                data: pending,
            });
        } catch (error) {
            next(error);
        }
    };

    requestPayout = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const payout = await this._requestPayoutUseCase.execute(
                userId,
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: payoutMessages.SUCCESS.PAYOUT_REQUEST_CREATED,
                data: payout,
            });
        } catch (error) {
            next(error);
        }
    };

    listPayouts = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const results = await this._listPayoutRequestUseCase.execute(
                userId,
                {
                    sort: req.query.sort as 'asc' | 'desc',
                    page,
                    limit,
                },
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: payoutMessages.SUCCESS.PAYOUTS_FETCHED,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    };
}
