import type { KycStatusType } from '@/constants/types/Kyc';
import type { UserGenderType } from '@/constants/types/User';

export interface IPsychologistDto {
  id: string;
  userId: string;
  name: string;
  email: string;
  profileImage?: string;
  aboutMe: string;
  qualification: string;
  defaultFee: number;
  specializations: string[];
  specializationFees: string[];
  averageRating?: number;
  totalReviews?: number;
}

export interface IPsychologistProfileDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: UserGenderType;
  dateOfBirth?: string;
  defaultFee: number;
  qualification: string;
  aboutMe: string;
  specializations: string[];
  profileImage: string;
  kycStatus: KycStatusType;
  specializationFees: string[];
  averageRating?: number;
  totalReviews?: number;
}

export interface IGetAllPsychologistsDto {
  id: string;
  qualification: string;
  defaultFee: number;
  aboutMe: string;
  specializationFees: string[];
  specializations: string[];
  isVerified: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    profileImage: string;
  };
}

export interface ITopPsychologistDto {
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
  specializations: string[];
  totalConsultations: number;
}
