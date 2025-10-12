import { PayoutRequest } from '@/domain/entities/payoutRequest';

export interface IApprovePayoutRequest {
    execute(payoutRequestId: string): Promise<PayoutRequest | null>;
}
