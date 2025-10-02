import { ICreateWalletUseCase } from '@/useCases/interfaces/user/wallet/ICreateWalletUseCase';
import { Wallet } from '@/domain/entities/wallet';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';

export class CreateWalletUseCase implements ICreateWalletUseCase {
    private _walletRepo: IWalletRepository;

    constructor(walletRepo: IWalletRepository) {
        this._walletRepo = walletRepo;
    }

    async execute(userId: string, currency: string): Promise<Wallet> {
        const existing = await this._walletRepo.findByUserId(userId);
        if (existing) return existing;

        return this._walletRepo.createForUser(userId, currency);
    }
}
