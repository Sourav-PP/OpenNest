import { SubscriptionStatus } from '../enums/PlanEnums';

export interface Subscription {
    id: string;
    userId: string;
    planId: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
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
}
