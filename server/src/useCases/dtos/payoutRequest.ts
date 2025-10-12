export interface PayoutRequestListItemDto {
    id: string;
    consultationIds: string[];
    requestedAmount: number;
    commissionAmount: number;
    payoutAmount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt?: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
    psychologist: {
        id: string;
        name: string;
        profileImage?: string;
    };
}