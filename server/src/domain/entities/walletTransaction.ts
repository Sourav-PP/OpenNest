import {
    WalletTransactionStatus,
    WalletTransactionType,
} from '../enums/WalletEnums';

export interface WalletTransaction {
    id: string;
    walletId: string;
    amount: number;
    type: WalletTransactionType;
    status: WalletTransactionStatus;
    reference?: string;
    metadata?: any;
}
