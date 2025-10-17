import type {
  IGetChatHistoryResponse,
  IGetChatByPatientResponse,
  IGetChatByPsychologistResponse,
  IUploadMediaResponse,
} from '@/types/api/chat';
import { server } from '../server';
import type { BackendResponse } from '@/types/api/api';
import { chatRoutes } from '@/constants/apiRoutes/chatRoutes';

export const chatApi = {
  getChatByPatient: async () => server.get<IGetChatByPatientResponse>(chatRoutes.chatByPatient),
  getChatByPsychologist: async () => server.get<IGetChatByPsychologistResponse>(chatRoutes.chatByPsychologist),
  uploadMedia: async (data: FormData) =>
    server.post<IUploadMediaResponse, FormData>(chatRoutes.uploadMedia, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getChatHistory: async (consultationId: string) =>
    server.get<IGetChatHistoryResponse>(chatRoutes.chatHistory(consultationId)),
  getUnreadCount: async (consultationId: string) => server.get<BackendResponse>(chatRoutes.unreadCount(consultationId)),
  markAsRead: async (consultationId: string) =>
    server.put<BackendResponse, void>(chatRoutes.markAsRead(consultationId)),
};
