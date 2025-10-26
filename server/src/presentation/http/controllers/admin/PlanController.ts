import { Request, Response, NextFunction } from 'express';
import { IGetAllPlanUseCase } from '@/useCases/interfaces/admin/plan/IGetAllPlanUseCase';
import { ICreatePlanUseCase } from '@/useCases/interfaces/admin/plan/ICreatePlanUseCase';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IDeletePlanUseCase } from '@/useCases/interfaces/admin/plan/IDeletePlanUseCase';

export class PlanController {
    private _getAllPlansUseCase: IGetAllPlanUseCase;
    private _createPlanUseCase: ICreatePlanUseCase;
    private _deletePlanUseCase: IDeletePlanUseCase;

    constructor(getAllPlansUseCase: IGetAllPlanUseCase, createPlanUseCase: ICreatePlanUseCase, deletePlanUseCase: IDeletePlanUseCase) {
        this._getAllPlansUseCase = getAllPlansUseCase;
        this._createPlanUseCase = createPlanUseCase;
        this._deletePlanUseCase = deletePlanUseCase;
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

    deletePlan = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { planId } = req.params;
            await this._deletePlanUseCase.execute(planId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SubscriptionMessages.SUCCESS.PLAN_DELETED,
            });
        } catch (error) {
            next(error);
        }
    };
}
