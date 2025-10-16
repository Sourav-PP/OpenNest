import { Plan } from '@/domain/entities/plan';
import { PlanBillingPeriod } from '@/domain/enums/PlanEnums';

export interface ICreatePlanUseCase {
    execute(data: {
        name: string;
        description?: string;
        price: number;
        currency: string;
        creditsPerPeriod: number;
        billingPeriod: PlanBillingPeriod;
    }): Promise<Plan>;
}
