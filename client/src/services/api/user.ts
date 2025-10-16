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
  IUserConsultationHistoryDetailResponse,
  IGetNotificationsResponse,
  IGetActiveSubscriptionResponse,
  IGetAllPlansResponse,
} from '../../types/api/user';

import { server } from '../server';
import type { BackendResponse } from '@/types/api/api';
import type { IChangePasswordRequest } from '@/types/api/auth';
import type { ISubscriptionDto } from '@/types/dtos/subscription';

export const userApi = {
  getAllPsychologists: async (params?: IGetAllPsychologistRequest) =>
    server.get<IGetAllPsychologistResponse>('/user/psychologists', { params }),
  getPsychologistById: async (id: string) => server.get<IGetPsychologistByIdResponse>(`/user/psychologists/${id}`),
  getProfile: async (): Promise<IGetUserProfileResponse> => server.get('/user/profile'),
  updateProfile: async (data: FormData): Promise<IGetUserProfileResponse> =>
    server.put('/user/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  changePassword: async (data: IChangePasswordRequest): Promise<BackendResponse> =>
    server.put('/auth/change-password', data),
  getSlotsByPsychologist: async (userId: string, date: string) =>
    server.get<IGetSlotsByPsychologistResponse>(`/user/psychologists/${userId}/slots`, {
      params: { date },
    }),
  createCheckoutSession: async (input: ICreateCheckoutSessionInput) =>
    server.post<ICreateCheckoutSessionResponse, ICreateCheckoutSessionInput>(
      '/user/payment/create-checkout-session',
      input
    ),
  getUserConsultations: async (params?: IGetUserConsultationsRequest) =>
    server.get<IGetUserConsultationsResponse>('/user/consultations', { params }),
  UserConsultationsDetail: async (id: string) =>
    server.get<IUserConsultationDetailsResponse>(`/user/consultation/${id}`),
  cancelConsultation: async (id: string, reason: string) =>
    server.put<BackendResponse<IConsultationDto>, { reason: string }>(`/user/consultation/${id}/cancel`, { reason }),
  getUserConsultationHistory: async (params?: IGetUserConsultationHistoryRequest) =>
    server.get<IGetUserConsultationsResponse>('/user/consultation/history', { params }),
  getUserConsultationHistoryDetail: async (consultationId: string) =>
    server.get<IUserConsultationHistoryDetailResponse>(`/user/consultation/${consultationId}/history`),
  getNotifications: async (): Promise<IGetNotificationsResponse> => server.get('/user/notification'),
  markAllNotificationAsRead: async (): Promise<void> =>
    server.patch<void, Record<string, string>>('/user/notification/mark-all-read', {}),
  getActiveSubscription: async () => server.get<IGetActiveSubscriptionResponse>('/user/subscription/active'),
  // cancelSubscription: async() => server.post<{ subscription: ISubscriptionDto | null }>('/user/subscription/cancel', {}),
  getPlans: async () => server.get<IGetAllPlansResponse>('/user/plans'),
  createSubscriptionCheckoutSession: async (planId: string, psychologistId: string) =>
    server.post<BackendResponse<{ url: string }>, { planId: string; psychologistId: string }>(
      '/user/payment/create-subscription-session',
      { planId, psychologistId }
    ),
  bookConsultationWithSubscription: async (data: { subscriptionId: string; slotId: string; sessionGoal: string }) =>
    server.post<
      BackendResponse<{ consultation: IConsultationDto; subscription: ISubscriptionDto }>,
      { subscriptionId: string; slotId: string; sessionGoal: string }
    >('/user/consultation/book-with-subscription', data),
};
