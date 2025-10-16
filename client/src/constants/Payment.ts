export const PaymentMethod = {
  STRIPE: 'stripe',
  WALLET: 'wallet',
} as const;

export type PaymentMethodType =(typeof PaymentMethod)[keyof typeof PaymentMethod];


export const PaymentStatus = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

export type PaymentStatusType =(typeof PaymentStatus)[keyof typeof PaymentStatus];


export const PaymentPurpose = {
  CONSULTATION: 'consultation',
  WALLET: 'wallet',
  SUBSCRIPTION: 'subscription',
} as const;

export type PaymentPurposeType =(typeof PaymentPurpose)[keyof typeof PaymentPurpose];
