import { PayoutRequestStatus } from '@/domain/enums/PayoutRequestEnums';

export interface PayoutRequestListItemDto {
    id: string;
    consultationIds: string[];
    requestedAmount: number;
    commissionAmount: number;
    payoutAmount: number;
    status: PayoutRequestStatus;
    createdAt?: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
    psychologist: {
        id: string;
        name: string;
        profileImage?: string;
    };
}
