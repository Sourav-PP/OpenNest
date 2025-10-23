import { SpecializationFee } from '@/domain/entities/psychologist';
import { KycStatus } from '@/domain/enums/KycEnums';
import { UserGender } from '@/domain/enums/UserEnums';

export interface IPsychologistProfileDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    gender?: UserGender;
    dateOfBirth?: Date;
    defaultFee: number;
    qualification: string;
    aboutMe: string;
    specializations: string[];
    profileImage?: string;
    kycStatus: KycStatus;
    specializationFees: SpecializationFee[];
    averageRating?: number;
    totalReviews?: number
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
    averageRating?: number;
    totalReviews?: number
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
    averageRating?: number;
    totalReviews?: number;
    specializations: string[]
    totalConsultations: number;
}

export interface PsychologistReviewDTO {
  id: string;
  rating: number;
  userFeedback: string;
  createdAt: Date;
  patient: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface PaginatedPsychologistReviewsDTO {
  reviews: PsychologistReviewDTO[];
  total: number;
  hasMore: boolean;
}
