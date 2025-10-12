import { ClientSession } from 'mongoose';
import { Wallet } from '../entities/wallet';
import { WalletTransaction } from '../entities/walletTransaction';

export interface IWalletRepository {
  createForUser(userId: string, currency?: string): Promise<Wallet>
  findByUserId(userId: string): Promise<Wallet | null>
  findById(id: string): Promise<Wallet | null>
  createTransaction(
    data: Omit<WalletTransaction, 'id'>, session?: ClientSession,
  ): Promise<WalletTransaction>
  findTransactionByReference(reference: string): Promise<WalletTransaction | null>;
  updateBalance(walletId: string, amount: number, session?: ClientSession,): Promise<Wallet | null>;
  safeDebit(walletId: string, amount: number): Promise<Wallet | null>;
  listTransaction(
    walletId: string,
    skip: number,
    limit: number,
  ): Promise<WalletTransaction[]>;
  countAll(walletId: string): Promise<number>
  refundToWallet(walletId: string, amount: number, reference: string): Promise<void>;
}