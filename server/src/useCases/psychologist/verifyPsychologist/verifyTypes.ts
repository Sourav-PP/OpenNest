import { IKyc } from "../../../domain/entities/kyc";
import { IPsychologist } from "../../../domain/entities/psychologist";

export interface VerifyProfileRequest {
  userId: string;
  aboutMe: string;
  qualification: string;
  specializations: string[];
  defaultFee: number;
  isVerified: boolean;
  specializationFees: {
    specializationId: string;
    specializationName: string;
    fee: number;
  }[];
  identificationDoc: string;
  educationalCertification: string;
  experienceCertificate: string;
}

export interface VerifyProfileResponse {
  psychologist: IPsychologist,
  kyc: IKyc
}
