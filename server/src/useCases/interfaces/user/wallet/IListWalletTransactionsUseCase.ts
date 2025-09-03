import { WalletTransaction } from '@/domain/entities/walletTransaction';

export interface IListWalletTransactionsUseCase {
    execute(
        walletId: string,
        page: number,
        limit: number,
    ): Promise<{ data: WalletTransaction[], totalCount: number }>;
}
