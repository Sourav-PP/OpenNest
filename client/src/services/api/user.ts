import type { IConsultationDto } from '@/types/dtos/consultation';
import type {
  IGetUserConsultationsResponse,
  ICreateCheckoutSessionInput,
  ICreateCheckoutSessionResponse,
  IGetAllPsychologistRequest,
  IGetAllPsychologistResponse,
  IGetUserConsultationsRequest,
  IGetPsychologistByIdResponse,
  IGetUserProfileResponse,
  IGetSlotsByPsychologistResponse,
  IUserConsultationDetailsResponse,
  IGetUserConsultationHistoryRequest,
  IUserConsultationHistoryDetailResponse
} from '../../types/api/user';

import { server } from '../server';
import type { BackendResponse } from '@/types/api/api';
import type { IChangePasswordRequest } from '@/types/api/auth';

export const userApi = {
  getAllPsychologists: async(params?: IGetAllPsychologistRequest) => server.get<IGetAllPsychologistResponse>('/user/psychologists', {params}) ,
  getPsychologistById: async(id: string) => server.get<IGetPsychologistByIdResponse>(`/user/psychologists/${id}`),
  getProfile: async(): Promise<IGetUserProfileResponse> => server.get('/user/profile'),
  updateProfile: async(data: FormData): Promise<IGetUserProfileResponse> => server.put('/user/profile', data, {
    headers: { 'Content-Type' : 'multipart/form-data' }
  }),
  changePassword: async(data: IChangePasswordRequest): Promise<BackendResponse> => server.put('/auth/change-password', data),
  getSlotsByPsychologist: async(userId: string, date: string) => server.get<IGetSlotsByPsychologistResponse>(`/user/psychologists/${userId}/slots`, {
    params: {date}
  }),
  createCheckoutSession: async(input: ICreateCheckoutSessionInput) => server.post<ICreateCheckoutSessionResponse, ICreateCheckoutSessionInput>('/user/payment/create-checkout-session', input),
  getUserConsultations: async(params?: IGetUserConsultationsRequest) => server.get<IGetUserConsultationsResponse>('/user/consultations', {params}),
  UserConsultationsDetail: async(id: string) => server.get<IUserConsultationDetailsResponse>(`/user/consultation/${id}`),
  cancelConsultation: async(id: string, reason: string) => server.put<BackendResponse<IConsultationDto>, { reason: string }>(`/user/consultation/${id}/cancel`, { reason }),
  getUserConsultationHistory: async(params?: IGetUserConsultationHistoryRequest) => server.get<IGetUserConsultationsResponse>('/user/consultation/history', { params }),
  getUserConsultationHistoryDetail: async(consultationId: string) => server.get<IUserConsultationHistoryDetailResponse>(`/user/consultation/${consultationId}/history`),
};