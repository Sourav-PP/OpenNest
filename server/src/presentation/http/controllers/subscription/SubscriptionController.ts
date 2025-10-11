import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICancelSubscriptionUseCase } from '@/useCases/interfaces/subscription/ICancelSubscriptionUseCase';
import { IGetUserActiveSubscriptionUseCase } from '@/useCases/interfaces/subscription/IGetUserActiveSubscriptionUseCase';
import { IListPlansUseCase } from '@/useCases/interfaces/subscription/IListPlansUseCase';
import { Request, Response, NextFunction } from 'express';

export class SubscriptionController {
    private _getUserActiveSubscriptionUseCase: IGetUserActiveSubscriptionUseCase;
    private _cancelSubscriptionUseCase: ICancelSubscriptionUseCase;
    private _listPlansUseCase: IListPlansUseCase;

    constructor(
        getUserActiveSubscriptionUseCase: IGetUserActiveSubscriptionUseCase,
        cancelSubscriptionUseCase: ICancelSubscriptionUseCase,
        listPlansUseCase: IListPlansUseCase,
    ) {
        this._getUserActiveSubscriptionUseCase =
            getUserActiveSubscriptionUseCase;
        this._cancelSubscriptionUseCase = cancelSubscriptionUseCase;
        this._listPlansUseCase = listPlansUseCase;
    }

    getActiveSubscription = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(HttpStatus.OK).json(null);
                return;
            }

            const subscription =
                await this._getUserActiveSubscriptionUseCase.execute(userId);
            res.status(200).json({
                success: true,
                message:
                    SubscriptionMessages.SUCCESS.ACTIVE_SUBSCRIPTION_RETRIEVED,
                data: subscription,
            });
        } catch (error) {
            next(error);
        }
    };

    cancelSubscription = async(
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
            const subscription =
                await this._cancelSubscriptionUseCase.execute(userId);
            res.status(200).json({
                success: true,
                message: SubscriptionMessages.SUCCESS.SUBSCRIPTION_CANCELLED,
                data: subscription,
            });
        } catch (error) {
            next(error);
        }
    };

    listPlans = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const plans = await this._listPlansUseCase.execute();
            res.status(200).json({
                success: true,
                message: SubscriptionMessages.SUCCESS.PLANS_FETCHED,
                data: plans,
            });
        } catch (error) {
            next(error);
        }
    };
}
