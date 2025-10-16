import type { IWallet, IWalletTransaction } from '../dtos/wallet';
import type { BackendResponse } from './api';

export interface IListTransactionResponseData {
  transactions: IWalletTransaction[];
  totalCount: number;
}
export type IGetWalletResponse = BackendResponse<IWallet>;
export type IListTransactionResponse = BackendResponse<IListTransactionResponseData>;
