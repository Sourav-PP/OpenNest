import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreateWalletUseCase } from '@/useCases/interfaces/user/wallet/ICreateWalletUseCase';
import { NextFunction, Request, Response } from 'express';

export class CreateWalletController {
    private _createWalletUseCase: ICreateWalletUseCase;

    constructor(createWalletUseCase: ICreateWalletUseCase) {
        this._createWalletUseCase = createWalletUseCase;
    }

    handle = async(
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
}
