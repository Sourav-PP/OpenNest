import { PublicUser } from "../../../domain/entities/user";

export interface LoginRequest {
    email: string,
    password: string,
}

export interface LoginResponse {
    user: PublicUser
    accessToken: string
    refreshToken: string
}