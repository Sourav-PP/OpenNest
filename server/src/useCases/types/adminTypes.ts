import { IUserDto } from "../../domain/dtos/user";
import { IPsychologistListDto } from "../../domain/dtos/psychologist";
import { SpeicalizationFee } from "../../domain/entities/psychologist";

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
    sort?: "asc" | "desc";
    gender?: "Male" | "Female";
    page?: number;
    limit?: number
}

export interface IGetAllUserResponse {
    user: IUserDto[];
    totalCount?: number
}

export interface IGetAllPsychologistRequest {
    search?: string;
    sort?: "asc" | "desc";
    gender?: "Male" | "Female";
    page?: number;
    limit?: number
}

export interface IGetAllPsychologistDto {
      id: string;
      aboutMe: string;
      qualification: string;
      defaultFee: number;
      isVerified: boolean;
      user: {
        name: string;
        email: string;
        profileImage?: string;
      };
      specializations: string[];
      specializationFees: SpeicalizationFee[];
}

export interface IGetAllPsychologistResponse {
    psychologists: IGetAllPsychologistDto[];
    totalCount?: number
}