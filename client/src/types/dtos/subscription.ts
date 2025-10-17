import type { PlanBillingPeriodType, SubscriptionStatusType } from '@/constants/types/Plan';

export interface ISubscriptionDto {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  creditRemaining: number;
  creditsPerPeriod: number;
  status: SubscriptionStatusType;
  currentPeriodStart?: Date;
  currentPeriodEnd: Date;
  canceledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  plan: {
    id: string;
    name: string;
    description?: string;
    price: number;
    billingPeriod: PlanBillingPeriodType;
    creditsPerPeriod: number;
  };
}
