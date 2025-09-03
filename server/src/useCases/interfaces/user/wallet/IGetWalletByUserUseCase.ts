import { Wallet } from '@/domain/entities/wallet';

export interface IGetWalletByUserUseCase {
    execute(userId: string): Promise<Wallet>;
}
