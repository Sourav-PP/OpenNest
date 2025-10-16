import { IUserDto } from '../dtos/user';
import { IKycDto } from '../dtos/kyc';
import { IPsychologistListDto } from '../dtos/psychologist';
import { PayoutRequestListItemDto } from '../dtos/payoutRequest';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { UserGender } from '@/domain/enums/UserEnums';
import { KycStatusFilter } from '@/domain/enums/KycEnums';

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
    sort?: SortFilter;
    gender?: UserGender;
    page?: number;
    limit?: number
}

export interface IGetAllUserResponse {
    user: IUserDto[];
    totalCount?: number
}

export interface IGetAllPendingPayoutRequest {
    search?: string;
    sort?: SortFilter;
    page?: number;
    limit?: number
}

export interface IGetAllPendingPayoutResponse {
    requests: PayoutRequestListItemDto[],
    totalCount: number;
}

export interface IGetAllPsychologistRequest {
    search?: string;
    sort?: SortFilter;
    gender?: UserGender;
    page?: number;
    limit?: number
}

export interface IGetAllPsychologistResponse {
    psychologists: IPsychologistListDto[]
    totalCount?: number
}

export interface IGetAllKycRequest {
    search?: string;
    sort?: SortFilter;
    page?: number;
    limit?: number;
    status?: KycStatusFilter;
}

export interface IGetAllKycResponse {
    kycs: IKycDto[];
    totalCount?: number
}