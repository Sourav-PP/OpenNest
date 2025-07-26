export interface Kyc  {
    id?: string,
    psychologistId: string,
    identificationDoc: string,
    educationalCertification: string,
    experienceCertificate: string,
    kycStatus: "pending" | "approved" | "rejected",
    rejectionReason?: string,
    verifiedAt?: Date
}

export interface publicKyc {
    id?: string,
    kycStatus: "pending" | "approved" | "rejected"
}