import type { PlanBillingPeriodType } from '@/constants/Plan';

export interface IPlanDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  creditsPerPeriod: number;
  billingPeriod: PlanBillingPeriodType;
  stripePriceId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
