export const psychologistRoutes = {
  profile: '/psychologist/profile',
  verifyProfile: '/auth/psychologist/verify-profile',
  slot: '/psychologist/slot',
  slotById: (slotId: string) => `/psychologist/slot/${slotId}`,
  kyc: '/psychologist/kyc',
  consultations: '/psychologist/consultations',
  consultationCancel: (id: string) => `/psychologist/consultation/${id}/cancel`,
  consultationHistory: '/psychologist/consultation/history',
  patientHistory: (patientId: string) => `/psychologist/patients/${patientId}/history`,
  pendingPayout: '/psychologist/payout/pending',
  requestPayout: '/psychologist/payout-requests',
  payoutHistory: '/psychologist/payout-requests',
  updateNotes: (consultationId: string) => `/psychologist/consultation/${consultationId}/notes`
} as const;
