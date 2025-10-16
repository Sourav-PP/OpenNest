import type { PayoutRequestStatusType } from '@/constants/PayoutRequest';

export interface IPayoutRequestDto {
  id: string;
  psychologistId: string;
  consultationIds: string[];
  requestedAmount: number;
  commissionAmount: number;
  payoutAmount: number;
  status: PayoutRequestStatusType;
  createdAt: Date;
  updatedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

export interface PayoutRequestListItemDto {
  id: string;
  consultationIds: string[];
  requestedAmount: number;
  commissionAmount: number;
  payoutAmount: number;
  status: PayoutRequestStatusType;
  createdAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  psychologist: {
    id: string;
    name: string;
    profileImage?: string;
  };
}
