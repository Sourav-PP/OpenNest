import type { WalletTransactionStatusType, WalletTransactionTypeValue } from '@/constants/types/Wallet';

export interface IWallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface IWalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: WalletTransactionTypeValue;
  status: WalletTransactionStatusType;
  reference?: string;
  metadata?: any;
}
