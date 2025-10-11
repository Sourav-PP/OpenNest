export interface ISubscriptionDto {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  creditRemaining: number;
  creditsPerPeriod: number;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'unpaid' | 'inactive';
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
    billingPeriod: 'month' | 'year' | 'week';
    creditsPerPeriod: number;
  };
}