export interface SignupRequest {
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    role: "user" | "psychologist"
}

export interface SignupResponse {
    user: {
        id: string,
        name: string,
        email: string,
        role: string
    };
    accessToken: string,
    refreshToken: string
    
}