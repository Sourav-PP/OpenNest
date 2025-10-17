export const chatRoutes = {
  chatByPatient: '/chat/patient',
  chatByPsychologist: '/chat/psychologist',
  uploadMedia: '/chat/upload',
  chatHistory: (consultationId: string) => `/chat/history/${consultationId}`,
  unreadCount: (consultationId: string) => `/chat/${consultationId}/unread-count`,
  markAsRead: (consultationId: string) => `/chat/${consultationId}/mark-read`,
} as const;