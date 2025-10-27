import type { PlanBillingPeriodType } from '@/constants/types/Plan';
import type { IBookingTrendDto, IClientTrend, IConsultationDtoForAdmin, IPsychologistBookingTrend, IRevenueStatDto, IUserTrendDto } from '../dtos/consultation';
import type { IPayoutRequestDto, PayoutRequestListItemDto } from '../dtos/payoutRequest';
import type { IGetAllPsychologistsDto, ITopPsychologistDto } from '../dtos/psychologist';
import type { IUserDto } from '../dtos/user';
import type { BackendResponse } from './api';
import type { SortFilterType } from '@/constants/types/SortFilter';
import type { KycStatusFilterType, KycStatusType } from '@/constants/types/Kyc';
import type { UserGenderFilterType } from '@/constants/types/User';

export interface IAdminLoginRequest {
  email: string;
  password: string;
}

export interface IAdminLoginResponse {
  accessToken: string;
}

export interface IAddServiceResponse {
  message: string;
  data: {
    name: string;
    description: string;
    bannerImage: string;
  };
}

export interface IAddPlanRequestData {
  name: string;
  description?: string;
  price: number;
  currency: string;
  creditsPerPeriod: number;
  billingPeriod: PlanBillingPeriodType;
}

export interface IAddPlanResponseData {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  creditsPerPeriod: number;
  billingPeriod: PlanBillingPeriodType;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllUserRequest {
  search?: string;
  sort?: SortFilterType;
  gender: UserGenderFilterType;
  page?: number;
  limit?: number;
}

export interface IGetAllUserResponseData {
  user: IUserDto[];
  totalCount?: number;
}

export interface IGetAllPendingPayoutRequest {
  search?: string;
  sort?: SortFilterType;
  page?: number;
  limit?: number;
}

export interface IGetAllPendingPayoutResponseData {
  requests: PayoutRequestListItemDto[];
  totalCount: number;
}

export interface IGetAllConsultationsResponseData {
  consultations: IConsultationDtoForAdmin[];
  totalCount?: number;
}

export interface IGetAllPsychologistsRequest {
  search?: string;
  sort?: SortFilterType;
  gender?: UserGenderFilterType;
  page?: number;
  limit?: number;
}

export interface IGetAllPsychologistResponseData {
  psychologists: IGetAllPsychologistsDto[];
  totalCount: number;
}

export interface IToggleStatusRequest {
  status: 'active' | 'inactive';
}

export interface IAdminKycDto {
  id: string;
  identificationDoc: string;
  educationalCertification: string;
  experienceCertificate: string;
  psychologistId: string;
  psychologistName: string;
  psychologistEmail: string;
  profileImage: string;
  qualification: string;
  status: KycStatusType;
}

export interface IGetAllKycDetailsRequest {
  search?: string;
  sort?: SortFilterType;
  status?: KycStatusFilterType;
  page?: number;
  limit?: number;
}

export interface IGetAllKycDetailsResponse {
  kycs: IAdminKycDto[];
  totalCount: number;
}

export interface IGetAdminDashboardTotalsResponseData {
  users: number;
  psychologists: number;
  consultations: number;
  revenue: number;
}

export type IGetAllUserResponse = BackendResponse<IGetAllUserResponseData>;
export type IGetAllPsychologistResponse = BackendResponse<IGetAllPsychologistResponseData>;
export type IGetAllConsultationResponse = BackendResponse<IGetAllConsultationsResponseData>;
export type IAddPlanResponse = BackendResponse<IAddPlanResponseData>;
export type IGetAllPlanResponse = BackendResponse<IAddPlanResponseData[]>;
export type IGetPendingPayoutResponse = BackendResponse<IGetAllPendingPayoutResponseData>;
export type IApprovePayoutResponse = BackendResponse<IPayoutRequestDto>;
export type IRejectPayoutResponse = BackendResponse<IPayoutRequestDto>;
export type ITopPsychologistResponse = BackendResponse<ITopPsychologistDto[]>;
export type IGetAdminDashboardTotalsResponse = BackendResponse<IGetAdminDashboardTotalsResponseData>;
export type IGetRevenueStatsResponse = BackendResponse<IRevenueStatDto[]>;
export type IGetPsychologistBookingTrendResponse = BackendResponse<IPsychologistBookingTrend[]>;
export type IGetClientTrendResponse = BackendResponse<IClientTrend[]>;
export type IGetUserTrendResponse = BackendResponse<IUserTrendDto[]>;
export type IGetBookingTrendResponse = BackendResponse<IBookingTrendDto[]>;
