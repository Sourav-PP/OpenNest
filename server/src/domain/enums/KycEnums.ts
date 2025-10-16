export enum KycStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export type KycStatusFilter = KycStatus | 'all';