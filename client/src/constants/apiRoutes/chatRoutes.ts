export const chatRoutes = {
  chatByPatient: '/chat/patient',
  chatByPsychologist: '/chat/psychologist',
  uploadMedia: '/chat/upload',
  chatHistory: (roomId: string) => `/chat/history/${roomId}`,
  unreadCount: (roomId: string) => `/chat/${roomId}/unread-count`,
  markAsRead: (roomId: string) => `/chat/${roomId}/mark-read`,
} as const;