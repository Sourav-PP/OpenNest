import { IListWalletTransactionsUseCase } from '@/useCases/interfaces/user/wallet/IListWalletTransactionsUseCase';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { WalletTransaction } from '@/domain/entities/walletTransaction';

export class ListWalletTransactionsUseCase implements IListWalletTransactionsUseCase
{
    private _walletRepo: IWalletRepository;

    constructor(walletRepo: IWalletRepository) {
        this._walletRepo = walletRepo;
    }

    async execute(
        walletId: string,
        page = 1,
        limit = 10,
    ): Promise<{ data: WalletTransaction[], totalCount: number }> {
        const skip = (page - 1) * limit;

        const transactions = await this._walletRepo.listTransaction(
            walletId,
            skip,
            limit,
        );

        const totalCount = await this._walletRepo.countAll(walletId);
        return {
            data: transactions,
            totalCount,
        };
    }
}
