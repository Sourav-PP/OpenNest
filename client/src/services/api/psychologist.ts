import { server } from '../server';
import type { IPsychologistProfileDto } from '@/types/dtos/psychologist';
import type { IRecurringSlotInput, ISingleSlotInput, IDeleteSlotResponse, IDeleteSlotInput } from '@/types/api/slot';
import type { ISlotDto } from '@/types/dtos/slot';
import type { IKycDto } from '@/types/dtos/kyc';
import type { BackendResponse } from '@/types/api/api';
import type { IGetUserConsultationHistoryRequest, IGetUserConsultationsRequest } from '@/types/api/user';
import type {
  IGetPatientConsultationHistoryResponse,
  IGetPayoutHistoryResponse,
  IGetPendingPayoutResponse,
  IGetPsychologistConsultationsResponse,
  IGetPsychologistReviewsResponse,
  IRequestPayoutResponse,
} from '@/types/api/psychologist';
import type { ITopConsultationDto, IConsultationDto } from '@/types/dtos/consultation';
import { psychologistRoutes } from '@/constants/apiRoutes/psychologistRoutes';
import { RevenueFilter, type RevenueFilterType, type SortFilterType } from '@/constants/types/SortFilter';
import type { IGetRevenueStatsResponse } from '@/types/api/admin';
import type { ITopUserDto } from '@/types/dtos/user';

export const psychologistApi = {
  getProfile: async () => server.get<IPsychologistProfileDto>(psychologistRoutes.profile),
  submitVerification: async (data: FormData) =>
    server.post<BackendResponse, FormData>(psychologistRoutes.verifyProfile, data),
  updatePsychologistProfile: async (data: FormData) =>
    server.put<IPsychologistProfileDto, FormData>(psychologistRoutes.profile, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  createSingleSlot: async (data: ISingleSlotInput) => server.post(psychologistRoutes.slot, data),
  createRecurringSlot: async (data: IRecurringSlotInput) => server.post(psychologistRoutes.slot, data),
  getPsychologistSlots: async () => server.get<ISlotDto[]>(psychologistRoutes.slot),
  deleteSlotByPsychologist: async (input: IDeleteSlotInput) =>
    server.delete<IDeleteSlotResponse>(psychologistRoutes.slotById(input.slotId)),
  getKycDetails: async () => server.get<IKycDto>(psychologistRoutes.kyc),
  getPsychologistConsultations: async (params?: IGetUserConsultationsRequest) =>
    server.get<IGetPsychologistConsultationsResponse>(psychologistRoutes.consultations, { params }),
  cancelConsultation: async (consultationId: string, reason: string) =>
    server.put<BackendResponse<IConsultationDto>, { reason: string }>(psychologistRoutes.consultationCancel(consultationId), {
      reason,
    }),
  getPsychologistConsultationHistory: async (params?: IGetUserConsultationHistoryRequest) =>
    server.get<IGetPsychologistConsultationsResponse>(psychologistRoutes.consultationHistory, { params }),
  getPatientHistory: async (patientId: string, params?: IGetUserConsultationHistoryRequest) =>
    server.get<IGetPatientConsultationHistoryResponse>(psychologistRoutes.patientHistory(patientId), { params }),
  getPendingPayout: async () => server.get<IGetPendingPayoutResponse>(psychologistRoutes.pendingPayout),
  requestPayout: async () => server.post<IRequestPayoutResponse, void>(psychologistRoutes.requestPayout),
  getPayoutHistory: async (params?: { page?: number; limit?: number; sort?: SortFilterType }) =>
    server.get<IGetPayoutHistoryResponse>(psychologistRoutes.payoutHistory, { params }),
  updateConsultationNotes: async (consultationId: string, data: { privateNotes?: string; feedback?: string }) =>
    server.put<BackendResponse<IConsultationDto>, typeof data>(psychologistRoutes.updateNotes(consultationId), data),
  getPsychologistReviews: async (psychologistId: string, page: number, limit: number) =>
    server.get<IGetPsychologistReviewsResponse>(psychologistRoutes.getReviews(psychologistId), {
      params: { page, limit },
    }),
  getRevenueStats: async (filter: RevenueFilterType = RevenueFilter.MONTHLY) =>
    server.get<IGetRevenueStatsResponse>(psychologistRoutes.revenueStats, { params: { filter } }),
  getTopUsers: async (limit: number) =>
    server.get<BackendResponse<ITopUserDto[]>>(psychologistRoutes.getTopUsers, { params: { limit } }),
  getTopConsultations: async (limit: number) =>
    server.get<BackendResponse<ITopConsultationDto[]>>(psychologistRoutes.getTopConsultations, { params: { limit } }),
  getTotals: async() => server.get<BackendResponse<{ totalConsultations: number; totalPatients: number}>>(psychologistRoutes.getTotals)
};
