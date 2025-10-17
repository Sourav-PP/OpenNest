import type { KycStatusType } from '@/constants/types/Kyc';

export interface IKycDto {
  id?: string;
  psychologistId: string;
  identificationDoc: string;
  educationalCertification: string;
  experienceCertificate: string;
  kycStatus: KycStatusType;
  rejectionReason?: string;
  verifiedAt?: Date;
}
