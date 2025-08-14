import type {
  IAdminLoginRequest,
  IAdminLoginResponse,
  IAddServiceResponse,
  IGetAllUserRequest,
  IGetAllUserResponse,
  IGetAllPsychologistResponse,
  IGetAllPsychologistsRequest,
  IToggleStatusRequest,
  IToggleStatusResponse,
  IGetAllKycDetailsRequest,
  IGetAllKycDetailsResponse,
  IAdminKycDto
} from '../../types/api/admin';

import { server } from '../server';

export const adminApi = {
  login: async(data: IAdminLoginRequest) => server.post<IAdminLoginResponse, IAdminLoginRequest>('/admin/login', data),
  logout: async() => server.post<void, undefined>('/admin/logout', undefined),
  addService: async(data: FormData) => server.post<IAddServiceResponse, FormData>('/admin/services', data),
  getAllUser: async(params?: IGetAllUserRequest) => server.get<IGetAllUserResponse>('/admin/users', {params}),
  getAllPsychologists: async(params?: IGetAllPsychologistsRequest) => server.get<IGetAllPsychologistResponse>('admin/psychologists', {params}),
  toggleUserStatus: async (userId: string, data: IToggleStatusRequest) =>server.patch<IToggleStatusResponse, IToggleStatusRequest>(`/admin/users/${userId}/status`, data),
  getAllKycDetails: async(params?: IGetAllKycDetailsRequest) => server.get<IGetAllKycDetailsResponse>('/admin/kyc', {params}),
  getKycDetailsByPsychologistId: async(psychologistId: string) => server.get<IAdminKycDto>(`/admin/kyc/${psychologistId}`),
  approveKyc: async(psychologistId: string) => server.patch<void, undefined>(`/admin/kyc/${psychologistId}/approve`, undefined),
  rejectKyc: async (psychologistId: string, reason: string) => server.patch<void, {reason:string}>(`/admin/kyc/${psychologistId}/reject`, {reason}),
};