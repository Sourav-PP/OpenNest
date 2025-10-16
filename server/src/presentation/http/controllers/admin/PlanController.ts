import { Request, Response, NextFunction } from 'express';
import { IGetAllPlanUseCase } from '@/useCases/interfaces/admin/plan/IGetAllPlanUseCase';
import { ICreatePlanUseCase } from '@/useCases/interfaces/admin/plan/ICreatePlanUseCase';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class PlanController {
    private _getAllPlansUseCase: IGetAllPlanUseCase;
    private _createPlanUseCase: ICreatePlanUseCase;

    constructor(getAllPlansUseCase: IGetAllPlanUseCase, createPlanUseCase: ICreatePlanUseCase) {
        this._getAllPlansUseCase = getAllPlansUseCase;
        this._createPlanUseCase = createPlanUseCase;
    }

    getAllPlans = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const plans = await this._getAllPlansUseCase.execute();

            res.status(HttpStatus.OK).json({
                success: true,
                message: SubscriptionMessages.SUCCESS.PLANS_FETCHED,
                data: plans,
            });
        } catch (error) {
            next(error);
        }
    };

    createPlan = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description, price, currency, creditsPerPeriod, billingPeriod } = req.body;

            const plan = await this._createPlanUseCase.execute({
                name,
                description,
                price,
                currency,
                creditsPerPeriod,
                billingPeriod,
            });

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: SubscriptionMessages.SUCCESS.PLAN_CREATED,
                data: plan,
            });
        } catch (error) {
            next(error);
        }
    };
}
