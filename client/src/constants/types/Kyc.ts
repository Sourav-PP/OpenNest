export const KycStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type KycStatusType = (typeof KycStatus)[keyof typeof KycStatus];

export const KycStatusFilter = {
  ALL: 'all',
  ...KycStatus,
} as const;

export type KycStatusFilterType = (typeof KycStatusFilter)[keyof typeof KycStatusFilter];

export const KycStatusColors: Record<KycStatusType, string> = {
  approved: 'bg-green-900/40 text-green-500',
  rejected: 'bg-red-900/40 text-red-500',
  pending: 'bg-yellow-900/40 text-yellow-500'
};
