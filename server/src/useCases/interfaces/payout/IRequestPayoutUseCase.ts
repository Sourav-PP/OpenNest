import { PayoutRequest } from '@/domain/entities/payoutRequest';

export interface IRequestPayoutUseCase {
    execute(psychologistId: string): Promise<PayoutRequest>;
}
