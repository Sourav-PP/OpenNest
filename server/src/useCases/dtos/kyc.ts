export interface IKycDto {
    id: string;
    psychologistId: string;
    psychologistName: string;
    psychologistEmail: string;
    qualification: string;
    status: 'pending' | 'approved' | 'rejected';
    profileImage: string;
    identificationDoc: string;
    educationalCertification: string;
    experienceCertificate: string;
}