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