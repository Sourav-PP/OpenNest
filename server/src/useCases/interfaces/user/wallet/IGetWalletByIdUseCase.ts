import { Wallet } from '@/domain/entities/wallet';

export interface IGetWalletByIdUseCase {
    execute(walletId: string): Promise<Wallet>;
}
