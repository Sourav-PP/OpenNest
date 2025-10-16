import { UserRole } from '@/domain/enums/UserEnums';

export interface ILoginInput {
    email: string;
    password: string;
}

export interface ILoginOutput {
    user: {
        name: string;
        email: string;
        role: UserRole;
        profileImage?: string;
    };
    accessToken: string;
    refreshToken: string;
    hasSubmittedVerificationForm: boolean;
}

export interface IGoogleLoginInput {
    credential: string;
    role: UserRole;
}

export interface IVerifyOtpOutput {
    user: {
        name: string;
        email: string;
        role: UserRole;
        profileImage?: string;
    };
    accessToken: string;
    refreshToken?: string;
}
