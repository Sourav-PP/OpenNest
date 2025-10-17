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
import { userRoutes } from '@/constants/apiRoutes/userRoutes';
import { authRoutes } from '@/constants/apiRoutes/authRoutes';

export const userApi = {
  getAllPsychologists: async (params?: IGetAllPsychologistRequest) =>
    server.get<IGetAllPsychologistResponse>(userRoutes.psychologists, { params }),
  getPsychologistById: async (id: string) => server.get<IGetPsychologistByIdResponse>(userRoutes.psychologistById(id)),
  getProfile: async (): Promise<IGetUserProfileResponse> => server.get(userRoutes.profile),
  updateProfile: async (data: FormData): Promise<IGetUserProfileResponse> =>
    server.put(userRoutes.profile, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: async (data: IChangePasswordRequest): Promise<BackendResponse> =>
    server.put(authRoutes.changePassword, data),
  getSlotsByPsychologist: async (userId: string, date: string) =>
    server.get<IGetSlotsByPsychologistResponse>(userRoutes.slotsByPsychologist(userId), { params: { date } }),
  createCheckoutSession: async (input: ICreateCheckoutSessionInput) =>
    server.post<ICreateCheckoutSessionResponse, ICreateCheckoutSessionInput>(userRoutes.createCheckoutSession, input),
  getUserConsultations: async (params?: IGetUserConsultationsRequest) =>
    server.get<IGetUserConsultationsResponse>(userRoutes.consultations, { params }),
  UserConsultationsDetail: async (id: string) =>
    server.get<IUserConsultationDetailsResponse>(userRoutes.consultationDetail(id)),
  cancelConsultation: async (id: string, reason: string) =>
    server.put<BackendResponse<IConsultationDto>, { reason: string }>(userRoutes.consultationCancel(id), { reason }),
  getUserConsultationHistory: async (params?: IGetUserConsultationHistoryRequest) =>
    server.get<IGetUserConsultationsResponse>(userRoutes.consultationHistory, { params }),
  getUserConsultationHistoryDetail: async (consultationId: string) =>
    server.get<IUserConsultationHistoryDetailResponse>(userRoutes.consultationHistoryDetail(consultationId)),
  getNotifications: async (): Promise<IGetNotificationsResponse> => server.get(userRoutes.notifications),
  markAllNotificationAsRead: async (): Promise<void> =>
    server.patch<void, Record<string, string>>(userRoutes.markAllNotificationsRead, {}),
  getActiveSubscription: async () => server.get<IGetActiveSubscriptionResponse>(userRoutes.activeSubscription),
  getPlans: async () => server.get<IGetAllPlansResponse>(userRoutes.plans),
  createSubscriptionCheckoutSession: async (planId: string, psychologistId: string) =>
    server.post<BackendResponse<{ url: string }>, { planId: string; psychologistId: string }>(
      userRoutes.createSubscriptionCheckoutSession,
      { planId, psychologistId }
    ),
  bookConsultationWithSubscription: async (data: { subscriptionId: string; slotId: string; sessionGoal: string }) =>
    server.post<
      BackendResponse<{ consultation: IConsultationDto; subscription: ISubscriptionDto }>,
      { subscriptionId: string; slotId: string; sessionGoal: string }
    >(userRoutes.bookConsultationWithSubscription, data),
};
