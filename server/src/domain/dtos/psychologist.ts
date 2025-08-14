import { SpeicalizationFee } from '../entities/psychologist';

export interface IPsychologistListDto {
  id: string;
  userId: string;
  aboutMe: string;
  qualification: string;
  defaultFee: number;
  isVerified: boolean;
  user: {
    name: string;
    email: string;
    profileImage?: string;
  };
  specializations: string[];
  specializationFees: SpeicalizationFee[];
}

export interface IPsychologistResponseDto {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  aboutMe: string;
  qualification: string;
  defaultFee: number;
  specializations: string[];
  specializationFees: SpeicalizationFee[];
}
