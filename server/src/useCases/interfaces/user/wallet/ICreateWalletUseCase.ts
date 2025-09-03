import { Wallet } from '@/domain/entities/wallet';

export interface ICreateWalletUseCase {
    execute(userId: string, currency: string): Promise<Wallet>;
}
