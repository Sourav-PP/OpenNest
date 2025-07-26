export interface ISignupInput {
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    role: "user" | "psychologist"
}

export interface ISignupOutput {
    user: {
        name: string,
        email: string,
        role: "user" | "psychologist"
    }
    accessToken: string,
    refreshToken: string
}