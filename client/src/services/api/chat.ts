import type {
  IGetChatHistoryResponse,
  IGetChatByPatientResponse,
  IGetChatByPsychologistResponse,
  IUploadMediaResponse,
} from '@/types/api/chat';
import { server } from '../server';
import type { BackendResponse } from '@/types/api/api';

export const chatApi = {
  getChatByPatient: async () => server.get<IGetChatByPatientResponse>('/chat/patient'),
  getChatByPsychologist: async () => server.get<IGetChatByPsychologistResponse>('/chat/psychologist'),
  uploadMedia: async (data: FormData) =>
    server.post<IUploadMediaResponse, FormData>('/chat/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getChatHistory: async (consultationId: string) =>
    server.get<IGetChatHistoryResponse>(`/chat/history/${consultationId}`),
  getUnreadCount: async (consultationId: string) => server.get<BackendResponse>(`/chat/${consultationId}/unread-count`),
  markAsRead: async (consultationId: string) => server.put<BackendResponse, void>(`/chat/${consultationId}/mark-read`),
};
