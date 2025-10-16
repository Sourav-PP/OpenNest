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
  IRequestPayoutResponse,
} from '@/types/api/psychologist';
import type { IConsultationDto } from '@/types/dtos/consultation';

export const psychologistApi = {
  getProfile: async () => server.get<IPsychologistProfileDto>('/psychologist/profile'),
  submitVerification: async (data: FormData) =>
    server.post<BackendResponse, FormData>('/auth/psychologist/verify-profile', data),
  updatePsychologistProfile: async (data: FormData) =>
    server.put<IPsychologistProfileDto, FormData>('/psychologist/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  createSingleSlot: async (data: ISingleSlotInput) => server.post('/psychologist/slot', data),
  createRecurringSlot: async (data: IRecurringSlotInput) => server.post('/psychologist/slot', data),
  getPsychologistSlots: async () => server.get<ISlotDto[]>('/psychologist/slot'),
  deleteSlotByPsychologist: async (input: IDeleteSlotInput) =>
    server.delete<IDeleteSlotResponse>(`/psychologist/slot/${input.slotId}`),
  getKycDetails: async () => server.get<IKycDto>('/psychologist/kyc'),
  getPsychologistConsultations: async (params?: IGetUserConsultationsRequest) =>
    server.get<IGetPsychologistConsultationsResponse>('/psychologist/consultations', { params }),
  cancelConsultation: async (id: string, reason: string) =>
    server.put<BackendResponse<IConsultationDto>, { reason: string }>(`/psychologist/consultation/${id}/cancel`, {
      reason,
    }),
  getPsychologistConsultationHistory: async (params?: IGetUserConsultationHistoryRequest) =>
    server.get<IGetPsychologistConsultationsResponse>('/psychologist/consultation/history', { params }),
  getPatientHistory: async (patientId: string, params?: IGetUserConsultationHistoryRequest) =>
    server.get<IGetPatientConsultationHistoryResponse>(`/psychologist/patients/${patientId}/history`, { params }),
  getPendingPayout: async () => server.get<IGetPendingPayoutResponse>('/psychologist/payout/pending'),
  requestPayout: async () => server.post<IRequestPayoutResponse, void>('/psychologist/payout-requests'),
  getPayoutHistory: async (params?: { page?: number; limit?: number; sort?: 'asc' | 'desc' }) =>
    server.get<IGetPayoutHistoryResponse>('/psychologist/payout-requests', { params }),
};
