import { PayoutRequest } from '@/domain/entities/payoutRequest';

export interface IRejectPayoutRequestUseCase {
    execute(id: string, reason?: string): Promise<PayoutRequest | null>;
}
