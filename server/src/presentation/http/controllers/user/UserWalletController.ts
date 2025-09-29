import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreateWalletTransactionUseCase } from '@/useCases/interfaces/user/wallet/ICreateWalletTransactionUseCase';
import { ICreateWalletUseCase } from '@/useCases/interfaces/user/wallet/ICreateWalletUseCase';
import { IGetWalletByIdUseCase } from '@/useCases/interfaces/user/wallet/IGetWalletByIdUseCase';
import { IGetWalletByUserUseCase } from '@/useCases/interfaces/user/wallet/IGetWalletByUserUseCase';
import { IListWalletTransactionsUseCase } from '@/useCases/interfaces/user/wallet/IListWalletTransactionsUseCase';
import { NextFunction, Request, Response } from 'express';

export class UserWalletController {
    private _createWalletUseCase: ICreateWalletUseCase;
    private _createWalletTransactionUseCase: ICreateWalletTransactionUseCase;
    private _getWalletByIdUseCase: IGetWalletByIdUseCase;
    private _getWalletByUserUseCase: IGetWalletByUserUseCase;
    private _listWalletTransactionUseCase: IListWalletTransactionsUseCase;

    constructor(
        createWalletUseCase: ICreateWalletUseCase,
        createWalletTransactionUseCase: ICreateWalletTransactionUseCase,
        getWalletByIdUseCase: IGetWalletByIdUseCase,
        getWalletByUserUseCase: IGetWalletByUserUseCase,
        listWalletTransactionUseCase: IListWalletTransactionsUseCase,
    ) {
        this._createWalletUseCase = createWalletUseCase;
        this._createWalletTransactionUseCase = createWalletTransactionUseCase;
        this._getWalletByIdUseCase = getWalletByIdUseCase;
        this._getWalletByUserUseCase = getWalletByUserUseCase;
        this._listWalletTransactionUseCase = listWalletTransactionUseCase;
    }

    create = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId)
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );

            const wallet = await this._createWalletUseCase.execute(
                userId,
                'USD',
            );
            res.status(HttpStatus.CREATED).json({
                success: true,
                message: walletMessages.SUCCESS.CREATED,
                data: wallet,
            });
        } catch (error) {
            next(error);
        }
    };

    createTransaction = async(
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

    getById = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { walletId } = req.params;
            const wallet = await this._getWalletByIdUseCase.execute(walletId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: walletMessages.SUCCESS.FETCHED,
                data: wallet,
            });
        } catch (error) {
            next(error);
        }
    };

    getByUser = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId)
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            const wallet = await this._getWalletByUserUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: walletMessages.SUCCESS.FETCHED,
                data: wallet,
            });
        } catch (error) {
            next(error);
        }
    };

    listTransactions = async(
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
