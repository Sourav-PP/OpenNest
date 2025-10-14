import type { BackendResponse } from '@/types/api/api';
import {
  type IAdminLoginRequest,
  type IAdminLoginResponse,
  type IAddServiceResponse,
  type IGetAllUserRequest,
  type IGetAllUserResponse,
  type IGetAllPsychologistResponse,
  type IGetAllPsychologistsRequest,
  type IToggleStatusRequest,
  type IGetAllKycDetailsRequest,
  type IGetAllKycDetailsResponse,
  type IAdminKycDto,
  type IGetAllConsultationResponse,
  type IAddPlanResponse,
  type IGetAllPlanResponse,
  type IAddPlanRequestData,
  type IGetAllPendingPayoutRequest,
  type IGetPendingPayoutResponse,
  type IRejectPayoutResponse,
  type IApprovePayoutResponse,
  type ITopPsychologistResponse
} from '../../types/api/admin';

import { server } from '../server';

export const adminApi = {
  login: async(data: IAdminLoginRequest) => server.post<IAdminLoginResponse, IAdminLoginRequest>('/admin/login', data),
  logout: async() => server.post<void, undefined>('/admin/logout', undefined),
  addService: async(data: FormData) => server.post<IAddServiceResponse, FormData>('/admin/services', data),
  deleteService: async (id: string) => server.delete<BackendResponse>(`/admin/services/${id}`),
  getAllUser: async(params?: IGetAllUserRequest) => server.get<IGetAllUserResponse>('/admin/users', {params}),
  getAllPsychologists: async(params?: IGetAllPsychologistsRequest) => server.get<IGetAllPsychologistResponse>('admin/psychologists', {params}),
  toggleUserStatus: async (userId: string, data: IToggleStatusRequest) =>server.patch<BackendResponse, IToggleStatusRequest>(`/admin/users/${userId}/status`, data),
  getAllKycDetails: async(params?: IGetAllKycDetailsRequest) => server.get<IGetAllKycDetailsResponse>('/admin/kyc', {params}),
  getKycDetailsByPsychologistId: async(psychologistId: string) => server.get<IAdminKycDto>(`/admin/kyc/${psychologistId}`),
  approveKyc: async(psychologistId: string) => server.patch<void, undefined>(`/admin/kyc/${psychologistId}/approve`, undefined),
  rejectKyc: async (psychologistId: string, reason: string) => server.patch<void, {reason:string}>(`/admin/kyc/${psychologistId}/reject`, {reason}),
  getAllConsultations: async(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: 'asc' | 'desc';
    status?: 'all' | 'booked' | 'completed' | 'cancelled' | 'rescheduled';
  }) => server.get<IGetAllConsultationResponse>('/admin/consultations', {params}), 
  addPlan: async(data: IAddPlanRequestData) => server.post<IAddPlanResponse, IAddPlanRequestData>('/admin/plans', data),
  getAllPlans: async() => server.get<IGetAllPlanResponse>('/admin/plans'),
  getPendingPayouts: async(params?: IGetAllPendingPayoutRequest) => server.get<IGetPendingPayoutResponse>('/admin/payout-requests', { params }),
  approvePayout: async(payoutRequestId: string) =>
    server.patch<IApprovePayoutResponse, void>(`/admin/payout-requests/${payoutRequestId}/approve`, undefined),
  rejectPayout: async(payoutRequestId: string) =>
    server.patch<IRejectPayoutResponse, void>(`/admin/payout-requests/${payoutRequestId}/reject`, undefined),
  getTopPsychologists: async(limit: number) => server.get<ITopPsychologistResponse>('/admin/top-psychologists', { params: { limit } })
};