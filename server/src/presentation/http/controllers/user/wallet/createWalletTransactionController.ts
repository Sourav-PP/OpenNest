import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreateWalletTransactionUseCase } from '@/useCases/interfaces/user/wallet/ICreateWalletTransactionUseCase';
import { NextFunction, Request, Response } from 'express';

export class CreateWalletTransactionController {
    private _createWalletTransactionUseCase: ICreateWalletTransactionUseCase;

    constructor(
        createWalletTransactionUseCase: ICreateWalletTransactionUseCase,
    ) {
        this._createWalletTransactionUseCase = createWalletTransactionUseCase;
    }

    handle = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { walletId } = req.params;
            const { amount, type, reference, metadata } = req.body;
            const transaction =
                await this._createWalletTransactionUseCase.execute(
                    walletId,
                    amount,
                    type,
                    reference,
                    metadata,
                );

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: walletMessages.SUCCESS.TRANSACTION_CREATED,
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    };
}
