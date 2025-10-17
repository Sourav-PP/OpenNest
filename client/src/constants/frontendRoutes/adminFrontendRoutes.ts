export const adminFrontendRoutes = {
  dashboard: '/admin/dashboard',
  users: '/admin/users',
  psychologists: '/admin/psychologists',
  kyc: '/admin/kyc',
  kycDetailsPath: '/admin/kyc/:psychologistId',
  kycDetails: (psychologistId: string) => `/admin/kyc/${psychologistId}`,
  services: '/admin/services',
  sessions: '/admin/sessions',
  plans: '/admin/plans',
  pendingPayouts: '/admin/payouts/pending',
  payoutHistory: '/admin/payouts/history',
} as const;
