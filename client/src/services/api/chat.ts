import type {
  IGetChatHistoryResponse,
  IGetChatByPatientResponse,
  IGetChatByPsychologistResponse
} from '@/types/api/chat';
import { server } from '../server';

export const chatApi = {
  getChatByPatient: async () => server.get<IGetChatByPatientResponse>('/chat/patient'),
  getChatByPsychologist: async () =>
    server.get<IGetChatByPsychologistResponse>('/chat/psychologist'),
  getChatHistory: async (consultationId: string) => server.get<IGetChatHistoryResponse>(`/chat/history/${consultationId}`)
};
