export const WalletTransactionType = {
  CREDIT: 'credit',
  DEBIT: 'debit',
  TRANSFER_IN: 'transferIn',
  TRANSFER_OUT: 'transferOut',
} as const;

export type WalletTransactionTypeValue = typeof WalletTransactionType[keyof typeof WalletTransactionType];

export const WalletTransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type WalletTransactionStatusType = typeof WalletTransactionStatus[keyof typeof WalletTransactionStatus];
