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
  specializationFees: string[]
}

export interface IPsychologistProfileDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other"
  dateOfBirth: string;
  defaultFee: number;
  qualification: string;
  aboutMe: string;
  specializations: string[]
  profileImage: string
  kycStatus: "verified" | "pending" | "rejected"
  specializationFees: string[]
}

export interface IGetAllPsychologistsDto {
  id: string;
  qualification: string;
  defaultFee: number;
  aboutMe: string;
  specializationFees: string[]
  specializations: string[];
  isVerified: boolean;
  user: {
      name: string;
      email: string;
      phone: string;
      isActive: string
      profileImage: string;
  }
}