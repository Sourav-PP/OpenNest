import {
    WalletTransactionStatus,
    WalletTransactionType,
} from '../enums/WalletEnums';

export interface WalletTransaction<TMetadata = Record<string, unknown>> {
    id: string;
    walletId: string;
    amount: number;
    type: WalletTransactionType;
    status: WalletTransactionStatus;
    reference?: string;
    metadata?: TMetadata;
}
