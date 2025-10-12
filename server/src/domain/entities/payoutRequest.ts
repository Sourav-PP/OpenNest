export interface PayoutRequest {
  id: string;
  psychologistId: string;
  consultationIds: string[];
  requestedAmount: number;
  commissionAmount: number;
  payoutAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}