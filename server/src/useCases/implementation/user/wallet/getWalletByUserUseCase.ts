import { IGetWalletByUserUseCase } from '@/useCases/interfaces/user/wallet/IGetWalletByUserUseCase';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { Wallet } from '@/domain/entities/wallet';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetWalletByUserUseCase implements IGetWalletByUserUseCase {
    private _walletRepo: IWalletRepository;

    constructor(walletRepo: IWalletRepository) {
        this._walletRepo = walletRepo;
    }

    async execute(userId: string): Promise<Wallet> {
        const wallet = await this._walletRepo.findByUserId(userId);

        if (!wallet) throw new AppError(adminMessages.ERROR.USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);

        return wallet;
    }
}
