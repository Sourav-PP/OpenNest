import { KycStatus } from '../enums/KycEnums';

export interface Kyc {
    id: string;
    psychologistId: string;
    identificationDoc: string;
    educationalCertification: string;
    experienceCertificate: string;
    kycStatus: KycStatus;
    rejectionReason?: string;
    verifiedAt?: Date;
}
