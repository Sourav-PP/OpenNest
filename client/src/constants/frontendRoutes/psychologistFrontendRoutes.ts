export const psychologistFrontendRoutes = {
  verification: '/psychologist/verification',
  profile: '/psychologist/profile',
  editProfile: '/psychologist/edit-profile',
  changePassword: '/psychologist/change-password',
  kyc: '/psychologist/kyc',
  slot: '/psychologist/slot',
  consultations: '/psychologist/consultations',
  consultationDetailPath: '/psychologist/consultations/:id',
  consultationDetail: (id: string) => `/psychologist/consultations/${id}`,
  chat: '/psychologist/chat',
  chatWithConsultationPath: '/psychologist/chat/:consultationId',
  chatWithConsultation: (consultationId: string) => `/psychologist/chat/${consultationId}`,
  videoCallPath: '/psychologist/consultations/:id/video',
  videoCall: (id: string) => `/psychologist/consultations/${id}/video`,
  consultationHistory: '/psychologist/consultation/history',
  consultationHistoryDetailPath: '/psychologist/consultation/:consultationId/history',
  consultationHistoryDetail: (consultationId: string) =>
    `/psychologist/consultation/${consultationId}/history`,
  patientHistoryPath: '/psychologist/patients/:patientId/history',
  patientHistory: (patientId: string) => `/psychologist/patients/${patientId}/history`,
  dashboard: '/psychologist/my-earning',
  reviews: '/psychologist/reviews'
} as const;
