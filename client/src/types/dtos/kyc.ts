export interface IKycDto {
    id?: string,
    psychologistId: string,
    identificationDoc: string,
    educationalCertification: string,
    experienceCertificate: string,
    kycStatus: 'pending' | 'approved' | 'rejected',
    rejectionReason?: string,
    verifiedAt?: Date
}