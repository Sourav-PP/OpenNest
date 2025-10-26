import { WalletTransaction } from '@/domain/entities/walletTransaction';
import { WalletTransactionType } from '@/domain/enums/WalletEnums';

export interface ICreateWalletTransactionUseCase {
    execute(
        walletId: string,
        amount: number,
        type: WalletTransactionType,
        reference?: string,
        metadata?: Record<string, unknown>,
    ): Promise<WalletTransaction>;
}
