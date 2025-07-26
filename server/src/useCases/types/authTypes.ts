export interface ILoginInput {
    email: string,
    password: string
}

export interface ILoginOutput {
    user: {
        name: string,
        email: string,
        role: "user" | "psychologist"
    },
    accessToken: string,
    refreshToken: string,
    hasSubmittedVerificationForm: boolean
}