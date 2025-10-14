import { SpecializationFee } from '@/domain/entities/psychologist';

export interface IPsychologistProfileDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: Date;
    defaultFee: number;
    qualification: string;
    aboutMe: string;
    specializations: string[];
    profileImage?: string;
    kycStatus: string;
    specializationFees: SpecializationFee[];
}

export interface IPsychologistListDto {
    id: string;
    aboutMe: string;
    qualification: string;
    defaultFee: number;
    isVerified: boolean;
    user: {
        id: string
        name: string;
        email: string;
        isActive: boolean;
        profileImage?: string;
    };
    specializations: string[];
    specializationFees: SpecializationFee[];
}

export interface IPsychologistListUserDto {
    id: string;
    userId: string;
    name: string;
    email: string;
    dateOfBirth?: Date;
    profileImage?: string;
    aboutMe: string;
    defaultFee: number;
    qualification: string;
    specializations: string[];
    specializationFees: SpecializationFee[];
}

export interface TopPsychologistDTO {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    aboutMe: string;
    qualification: string;
    isVerified: boolean;
    defaultFee: number;
    specializations: string[]
    totalConsultations: number;
}
