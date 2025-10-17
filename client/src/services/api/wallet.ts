import type { BackendResponse } from '@/types/api/api';
import { server } from '../server';
import type { IWalletTransaction } from '@/types/dtos/wallet';
import type { IGetWalletResponse, IListTransactionResponse } from '@/types/api/wallet';
import { userRoutes } from '@/constants/apiRoutes/userRoutes';
import type { WalletTransactionTypeValue } from '@/constants/types/Wallet';

export const walletApi = {
  create: async () => server.post<BackendResponse, void>(userRoutes.wallet),
  getWallet: async () => server.get<IGetWalletResponse>(userRoutes.wallet),
  createTransaction: async (walletId: string, data: { amount: number; type: WalletTransactionTypeValue }) =>
    server.post<IWalletTransaction, typeof data>(userRoutes.walletTransactionCreate(walletId), data),
  listTransactions: async (walletId: string, page = 1, limit = 10) =>
    server.get<IListTransactionResponse>(userRoutes.walletTransactions(walletId), {
      params: { page, limit },
    }),
};
