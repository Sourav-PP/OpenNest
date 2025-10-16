import { PayoutRequestStatus } from '../enums/PayoutRequestEnums';

export interface PayoutRequest {
    id: string;
    psychologistId: string;
    consultationIds: string[];
    requestedAmount: number;
    commissionAmount: number;
    payoutAmount: number;
    status: PayoutRequestStatus;
    createdAt?: Date;
    updatedAt?: Date;
    approvedAt?: Date;
    rejectedAt?: Date;
}
