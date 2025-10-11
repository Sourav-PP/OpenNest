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
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'unpaid' | 'inactive';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  canceledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
