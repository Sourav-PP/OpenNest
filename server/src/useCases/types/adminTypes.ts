import { IUserDto } from "../../domain/dtos/user";

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