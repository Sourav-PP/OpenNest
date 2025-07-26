export interface IAdminLoginRequest {
    email: string,
    password: string
}

export interface IAdminLoginResponse {
    accessToken: string,
    refreshToken: string
}