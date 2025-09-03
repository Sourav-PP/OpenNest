import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IListWalletTransactionsUseCase } from '@/useCases/interfaces/user/wallet/IListWalletTransactionsUseCase';
import { NextFunction, Request, Response } from 'express';

export class ListWalletTransactionController {
    private _listWalletTransactionUseCase: IListWalletTransactionsUseCase;

    constructor(listWalletTransactionUseCase: IListWalletTransactionsUseCase) {
        this._listWalletTransactionUseCase = listWalletTransactionUseCase;
    }

    handle = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { walletId } = req.params;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const transactions =
                await this._listWalletTransactionUseCase.execute(
                    walletId,
                    page,
                    limit,
                );

            console.log('transactions: ', transactions);

            res.status(HttpStatus.OK).json({
                success: true,
                message: walletMessages.SUCCESS.TRANSACTION_FETCHED,
                data: {
                    transactions: transactions.data,
                    totalCount: transactions.totalCount,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}
