export interface IWallet {
  id: string,
  userId: string,
  balance: number,
  currency: string,
}

export interface IWalletTransaction {
  id: string,
  walletId: string,
  amount: number,
  type: 'credit' | 'debit' | 'transferIn' | 'transferOut',
  status: 'pending' | 'completed' | 'failed',
  reference?: string,
  metadata?: any,
}