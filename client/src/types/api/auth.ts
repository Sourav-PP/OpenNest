export interface ILoginRequest {
    email: string,
    password: string
}

export interface ILoginResponse {
    success: boolean,
    message: string;
    user: {
        name: string,
        email: string,
        role: "user" | "psychologist"
    },
    accessToken: string,
    hasSubmittedVerificationForm: boolean
}

export interface IGoogleLoginInput {
    credential: string;
    role: "user" | "psychologist";
}

export interface IGoogleLoginResponse {
  user: {
    name: string;
    email: string;
    role: "user" | "psychologist";
    profileImage?: string;
  };
  accessToken: string;
  hasSubmittedVerificationForm: boolean;
}

export interface ISignupRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: "user" | "psychologist";
}

export interface ISignupResponse {
    user: {
        name: string,
        email: string,
        role: "user" | "psychologist"
    },
    accessToken: string
}

export interface ISendOtpRequest {
    email: string
}

export interface IVerifyOtpRequest {
    email: string,
    otp: string
}