export const PayoutRequestStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type PayoutRequestStatusType = (typeof PayoutRequestStatus)[keyof typeof PayoutRequestStatus];

export const PayoutRequestStatusColors: Record<PayoutRequestStatusType, string> = {
  approved: 'bg-green-900/40 text-green-500',
  rejected: 'bg-red-900/40 text-red-500',
  pending: 'bg-yellow-500',
};