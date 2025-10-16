import {
    PlanBillingPeriod,
    SubscriptionStatus,
} from '@/domain/enums/PlanEnums';

export interface ISubscriptionDto {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    creditRemaining: number;
    creditsPerPeriod: number;
    status: SubscriptionStatus;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    canceledAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    plan: {
        id: string;
        name: string;
        description?: string;
        price: number;
        billingPeriod: PlanBillingPeriod;
        creditsPerPeriod: number;
    };
}
