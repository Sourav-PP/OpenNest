import { PublicUser } from "../../../domain/entities/user"

export interface SignupRequest {
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    role: "user" | "psychologist"
}

export interface SignupResponse {
    user: PublicUser
    accessToken: string,
    refreshToken: string
    
}