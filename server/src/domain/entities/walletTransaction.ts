export interface WalletTransaction {
  id: string,
  walletId: string,
  amount: number,
  type: 'credit' | 'debit' | 'transferIn' | 'transferOut',
  status: 'pending' | 'completed' | 'failed',
  reference?: string,
  metadata?: any,
}