import type { IGetAllPsychologistsDto } from "../pasychologist";
import type { IUserDto } from "../user";

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

export interface IGetAllUserRequest {
    search?: string;
    sort?: "asc" | "desc";
    gender?: "Male" | "Female" | "";
    page?: number;
    limit?: number
}

export interface IGetAllUserResponse {
    user: IUserDto[],
    totalCount?: number
}

export interface IGetAllPsychologistsRequest {
    search?: string;
    sort?: "asc" | "desc";
    gender?: "Male" | "Female" | "";
    page?: number;
    limit?: number
}

export interface IGetAllPsychologistResponse {
    psychologists: IGetAllPsychologistsDto[],
    totalCount?: number
}

export interface IToggleStatusRequest {
  status: "active" | "inactive";
}

export interface IToggleStatusResponse {
  message: string;
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
    kycStatus: 'pending' | 'approved' | 'rejected'
}

export interface IGetAllKycDetailsRequest {
    search?: string;
    sort?: "asc" | "desc";
    status?: 'pending' | 'approved' | 'rejected' | 'all'
    page?: number;
    limit?: number
}

export interface IGetAllKycDetailsResponse {
    kycs: IAdminKycDto[],
    totalCount: number
}