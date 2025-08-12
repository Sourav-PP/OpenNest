export interface IKycDto {
    id: string;
    psychologistId: string;
    psychologistName: string;
    psychologistEmail: string;
    profileImage: string;
    qualification: string;
    identificationDoc: string;
    educationalCertification: string;
    experienceCertificate: string;
    status: 'pending' | 'approved' | 'rejected';
}