export const PlanBillingPeriod = {
  MONTH: 'month',
  YEAR: 'year',
  WEEK: 'week',
} as const;

export type PlanBillingPeriodType = typeof PlanBillingPeriod[keyof typeof PlanBillingPeriod];

export const SubscriptionStatus = {
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  TRIALING: 'trialing',
  UNPAID: 'unpaid',
  INACTIVE: 'inactive',
} as const;

export type SubscriptionStatusType = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];
