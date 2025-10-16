import type { KycStatusType } from '@/constants/Kyc';

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
