import { KycStatus } from '@/domain/enums/KycEnums';

export interface IKycDto {
    id: string;
    psychologistId: string;
    psychologistName: string;
    psychologistEmail: string;
    qualification: string;
    status: KycStatus;
    profileImage: string;
    identificationDoc: string;
    educationalCertification: string;
    experienceCertificate: string;
}
