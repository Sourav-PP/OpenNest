import { IAdmin } from "../../../domain/entities/admin";

export interface AdminLoginRequest {
    email: string,
    password: string
}

export interface AdminLoginResponse {
    accessToken: string,
    refreshToken: string
}