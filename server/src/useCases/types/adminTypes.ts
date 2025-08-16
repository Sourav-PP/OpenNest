import { IUserDto } from '../dtos/user';
import { IKycDto } from '../dtos/kyc';
import { IPsychologistListDto } from '../dtos/psychologist';

export interface IAdminLoginRequest {
    email: string,
    password: string
}

export interface IAdminLoginResponse {
    accessToken: string,
    refreshToken: string
}

export interface IGetAllUserRequest {
    search?: string;
    sort?: 'asc' | 'desc';
    gender?: 'Male' | 'Female';
    page?: number;
    limit?: number
}

export interface IGetAllUserResponse {
    user: IUserDto[];
    totalCount?: number
}

export interface IGetAllPsychologistRequest {
    search?: string;
    sort?: 'asc' | 'desc';
    gender?: 'Male' | 'Female';
    page?: number;
    limit?: number
}

export interface IGetAllPsychologistResponse {
    psychologists: IPsychologistListDto[]
    totalCount?: number
}

export interface IGetAllKycRequest {
    search?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected' | 'all';
}

export interface IGetAllKycResponse {
    kycs: IKycDto[];
    totalCount?: number
}