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

export interface IUserTrendDto {
    date: string;
    userCount: number;
    psychologistCount: number;
}

export interface IBookingTrend {
    date: string;
    completedOrBooked: number;
    cancelled: number;
}

export interface IPsychologistBookingTrend {
    date: string;
    completed: number;
    cancelled: number;
    booked: number;
}

export interface IUniqueClientTrend {
    date: string;
    uniqueUsers: number;
}
