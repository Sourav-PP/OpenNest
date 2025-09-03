import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetWalletByUserUseCase } from '@/useCases/interfaces/user/wallet/IGetWalletByUserUseCase';
import { NextFunction, Request, Response } from 'express';

export class GetWalletByUserController {
    private _getWalletByUserUseCase: IGetWalletByUserUseCase;

    constructor(getWalletByUserUseCase: IGetWalletByUserUseCase) {
        this._getWalletByUserUseCase = getWalletByUserUseCase;
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
}
