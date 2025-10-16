import { PlanBillingPeriod } from '../enums/PlanEnums';

export interface Plan {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    creditsPerPeriod: number;
    billingPeriod: PlanBillingPeriod;
    stripePriceId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
