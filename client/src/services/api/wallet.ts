import type { BackendResponse } from '@/types/api/api';
import { server } from '../server';
import type { IWalletTransaction } from '@/types/dtos/wallet';
import type { IGetWalletResponse, IListTransactionResponse } from '@/types/api/wallet';

export const walletApi = {
  create: async () => server.post<BackendResponse, void>('/user/wallet'),
  getWallet: async () => server.get<IGetWalletResponse>('/user/wallet'),
  createTransaction: async (walletId: string, data: { amount: number; type: 'credit' | 'debit' }) => server.post<IWalletTransaction, typeof data>(`/wallet/${walletId}/transactions`, data),
  listTransactions: async (walletId: string, page = 1, limit = 10) =>
    server.get<IListTransactionResponse>(`/user/wallet/${walletId}/transactions`, {
      params: { page, limit },
    }),
};
