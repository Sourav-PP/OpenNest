export interface IPsychologistDto {
  id: string;
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
  dateOfBirth: string;
  defaultFee: number;
  qualification: string;
  aboutMe: string;
  specializations: string[]
  profileImage: string
  kycStatus: "verified" | "pending" | "rejected"
  specializationFees: string[]
}