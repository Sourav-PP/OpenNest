import { ICreateWalletTransactionUseCase } from '@/useCases/interfaces/user/wallet/ICreateWalletTransactionUseCase';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { WalletTransaction } from '@/domain/entities/walletTransaction';
import { AppError } from '@/domain/errors/AppError';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { WalletTransactionStatus, WalletTransactionType } from '@/domain/enums/WalletEnums';

export class CreateWalletTransactionUseCase implements ICreateWalletTransactionUseCase {
    private _walletRepo: IWalletRepository;

    constructor(walletRepo: IWalletRepository) {
        this._walletRepo = walletRepo;
    }

    async execute(
        walletId: string,
        amount: number,
        type: WalletTransactionType,
        reference?: string,
        metadata?: Record<string, unknown>,
    ): Promise<WalletTransaction> {
        if (reference) {
            const existing = await this._walletRepo.findTransactionByReference(reference);
            if (existing) return existing;
        }

        if (amount < 0) {
            const abs = Math.abs(amount);
            const wallet = await this._walletRepo.safeDebit(walletId, abs);
            if (!wallet) throw new AppError(walletMessages.ERROR.INSUFFICIENT_FUNDS, HttpStatus.BAD_REQUEST);
        } else {
            await this._walletRepo.updateBalance(walletId, amount);
        }

        return await this._walletRepo.createTransaction({
            walletId,
            amount,
            type,
            reference,
            status: WalletTransactionStatus.COMPLETED,
            metadata,
        });
    }
}
