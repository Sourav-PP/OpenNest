import { IGetWalletByIdUseCase } from '@/useCases/interfaces/user/wallet/IGetWalletByIdUseCase';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { Wallet } from '@/domain/entities/wallet';
import { AppError } from '@/domain/errors/AppError';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetWalletByIdUseCase implements IGetWalletByIdUseCase {
    private _walletRepo: IWalletRepository;

    constructor(walletRepo: IWalletRepository) {
        this._walletRepo = walletRepo;
    }

    async execute(walletId: string): Promise<Wallet> {
        const wallet = await this._walletRepo.findById(walletId);

        if (!wallet)
            throw new AppError(
                walletMessages.ERROR.WALLET_ID_REQUIRED,
                HttpStatus.BAD_REQUEST,
            );
        return wallet;
    }
}
