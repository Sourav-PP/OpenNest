import { UserGender, UserRole } from '@/domain/enums/UserEnums';

export interface IUserDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: UserGender;
    isActive?: boolean;
}

export interface IUserUpdatedDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: UserGender;
}

export interface ILoginOutputDto {
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

export interface ITopUserDto {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        isActive: boolean;
        profileImage?: string;
    };
    totalConsultations: number;
    averageRating?: number;
}
