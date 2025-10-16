export const ConsultationStatus = {
  Booked: 'booked',
  Completed: 'completed',
  Cancelled: 'cancelled',
  Rescheduled: 'rescheduled',
  Missed: 'missed'
} as const;

export type ConsultationStatusType = (typeof ConsultationStatus)[keyof typeof ConsultationStatus];

export const ConsultationStatusFilter = {
  All: 'all',
  ...ConsultationStatus,
} as const;

export type ConsultationStatusFilterType = (typeof ConsultationStatusFilter)[keyof typeof ConsultationStatusFilter];

export const ConsultationStatusColors: Record<ConsultationStatusType, string> = {
  booked: 'bg-blue-600',
  completed: 'bg-green-900/40 text-green-500',
  cancelled: 'bg-red-900/40 text-red-500',
  rescheduled: 'bg-yellow-500',
  missed: 'bg-gray-600/40 text-gray-300'
};

export const ConsultationPaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
} as const;

export type ConsultationPaymentStatusType =(typeof ConsultationPaymentStatus)[keyof typeof ConsultationPaymentStatus];

export const ConsultationPaymentMethod = {
  STRIPE: 'stripe',
  WALLET: 'wallet',
  SUBSCRIPTION: 'subscription',
}as const;

export type ConsultationPaymentMethodType =(typeof ConsultationPaymentMethod)[keyof typeof ConsultationPaymentMethod];