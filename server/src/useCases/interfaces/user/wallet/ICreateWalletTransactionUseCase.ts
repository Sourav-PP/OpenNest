import { WalletTransaction } from '@/domain/entities/walletTransaction';

export interface ICreateWalletTransactionUseCase {
    execute(
        walletId: string,
        amount: number,
        type: 'credit' | 'debit' | 'transferIn' | 'transferOut',
        reference?: string,
        metadata?: any,
    ): Promise<WalletTransaction>;
}
