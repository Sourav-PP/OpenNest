import type { IConsultationDtoForAdmin } from '../dtos/consultation';
import type { IPayoutRequestDto, PayoutRequestListItemDto } from '../dtos/payoutRequest';
import type { IGetAllPsychologistsDto, ITopPsychologistDto } from '../dtos/psychologist';
import type { IUserDto } from '../dtos/user';
import type { BackendResponse } from './api';

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
    }
}

export interface IAddPlanRequestData {
    name: string;
    description?: string;
    price: number;
    currency: string;
    creditsPerPeriod: number;
    billingPeriod: 'month' | 'year' | 'week';
}

export interface IAddPlanResponseData {
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    creditsPerPeriod: number;
    billingPeriod: 'month' | 'year' | 'week';
    stripePriceId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IGetAllUserRequest {
    search?: string;
    sort?: 'asc' | 'desc';
    gender: 'male' | 'female' | 'all';
    page?: number;
    limit?: number
}

export interface IGetAllUserResponseData {
    user: IUserDto[],
    totalCount?: number
}

export interface IGetAllPendingPayoutRequest {
    search?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number
}

export interface IGetAllPendingPayoutResponseData {
    requests: PayoutRequestListItemDto[],
    totalCount: number
}

export interface IGetAllConsultationsResponseData {
    consultations: IConsultationDtoForAdmin[],
    totalCount?: number
}

export interface IGetAllPsychologistsRequest {
    search?: string;
    sort?: 'asc' | 'desc';
    gender?: 'male' | 'female' | 'all';
    page?: number;
    limit?: number
}

export interface IGetAllPsychologistResponseData {
    psychologists: IGetAllPsychologistsDto[],
    totalCount: number
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
    status: 'pending' | 'approved' | 'rejected'
}

export interface IGetAllKycDetailsRequest {
    search?: string;
    sort?: 'asc' | 'desc';
    status?: 'pending' | 'approved' | 'rejected' | 'all'
    page?: number;
    limit?: number
}

export interface IGetAllKycDetailsResponse {
    kycs: IAdminKycDto[],
    totalCount: number
}

export type IGetAllUserResponse = BackendResponse<IGetAllUserResponseData>
export type IGetAllPsychologistResponse = BackendResponse<IGetAllPsychologistResponseData>
export type IGetAllConsultationResponse = BackendResponse<IGetAllConsultationsResponseData>
export type IAddPlanResponse = BackendResponse<IAddPlanResponseData>
export type IGetAllPlanResponse = BackendResponse<IAddPlanResponseData[]>
export type IGetPendingPayoutResponse = BackendResponse<IGetAllPendingPayoutResponseData>
export type IApprovePayoutResponse = BackendResponse<IPayoutRequestDto>
export type IRejectPayoutResponse = BackendResponse<IPayoutRequestDto>
export type ITopPsychologistResponse = BackendResponse<ITopPsychologistDto[]>