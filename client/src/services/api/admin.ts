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
  type ITopPsychologistResponse,
  type IGetAdminDashboardTotalsResponse,
  type IGetRevenueStatsResponse,
} from '../../types/api/admin';

import { server } from '../server';
import type { ConsultationStatusFilterType } from '@/constants/types/Consultation';
import { RevenueFilter, TopPsychologistFilter, type RevenueFilterType, type SortFilterType, type TopPsychologistFilterType } from '@/constants/types/SortFilter';
import { adminRoutes } from '@/constants/apiRoutes/adminRoutes';

export const adminApi = {
  login: async (data: IAdminLoginRequest) =>
    server.post<IAdminLoginResponse, IAdminLoginRequest>(adminRoutes.login, data),
  logout: async () => server.post<void, undefined>(adminRoutes.logout, undefined),
  addService: async (data: FormData) => server.post<IAddServiceResponse, FormData>(adminRoutes.services, data),
  deleteService: async (id: string) => server.delete<BackendResponse>(adminRoutes.serviceById(id)),
  getAllUser: async (params?: IGetAllUserRequest) => server.get<IGetAllUserResponse>(adminRoutes.users, { params }),
  getAllPsychologists: async (params?: IGetAllPsychologistsRequest) =>
    server.get<IGetAllPsychologistResponse>(adminRoutes.psychologists, { params }),
  toggleUserStatus: async (userId: string, data: IToggleStatusRequest) =>
    server.patch<BackendResponse, IToggleStatusRequest>(adminRoutes.userStatus(userId), data),
  getAllKycDetails: async (params?: IGetAllKycDetailsRequest) =>
    server.get<IGetAllKycDetailsResponse>(adminRoutes.kyc, { params }),
  getKycDetailsByPsychologistId: async (psychologistId: string) =>
    server.get<IAdminKycDto>(adminRoutes.kycByPsychologistId(psychologistId)),
  approveKyc: async (psychologistId: string) =>
    server.patch<BackendResponse, undefined>(adminRoutes.approveKyc(psychologistId), undefined),
  rejectKyc: async (psychologistId: string, reason: string) =>
    server.patch<BackendResponse, { reason: string }>(adminRoutes.rejectKyc(psychologistId), { reason }),
  getAllConsultations: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: SortFilterType;
    status?: ConsultationStatusFilterType;
  }) => server.get<IGetAllConsultationResponse>(adminRoutes.consultations, { params }),
  addPlan: async (data: IAddPlanRequestData) =>
    server.post<IAddPlanResponse, IAddPlanRequestData>(adminRoutes.plans, data),
  getAllPlans: async () => server.get<IGetAllPlanResponse>(adminRoutes.plans),
  getPendingPayouts: async (params?: IGetAllPendingPayoutRequest) =>
    server.get<IGetPendingPayoutResponse>(adminRoutes.payoutRequests, { params }),
  approvePayout: async (payoutRequestId: string) =>
    server.patch<IApprovePayoutResponse, void>(adminRoutes.approvePayout(payoutRequestId), undefined),
  rejectPayout: async (payoutRequestId: string) =>
    server.patch<IRejectPayoutResponse, void>(adminRoutes.rejectPayout(payoutRequestId), undefined),
  getTopPsychologists: async (limit: number, sortBy: TopPsychologistFilterType = TopPsychologistFilter.CONSULTATION) =>
    server.get<ITopPsychologistResponse>(adminRoutes.topPsychologists, { params: { limit, sortBy } }),
  getDashboardTotals: async () => server.get<IGetAdminDashboardTotalsResponse>(adminRoutes.getTotals),
  getRevenueStats: async (filter: RevenueFilterType = RevenueFilter.MONTHLY) =>
    server.get<IGetRevenueStatsResponse>(adminRoutes.revenueStats, { params: { filter } }),
};
