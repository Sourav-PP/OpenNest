import { walletMessages } from '@/shared/constants/messages/walletMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetWalletByIdUseCase } from '@/useCases/interfaces/user/wallet/IGetWalletByIdUseCase';
import { NextFunction, Request, Response } from 'express';

export class GetWalletByIdController {
    private _getWalletByIdUseCase: IGetWalletByIdUseCase;

    constructor(getWalletByIdUseCase: IGetWalletByIdUseCase) {
        this._getWalletByIdUseCase = getWalletByIdUseCase;
    }

    handle = async(
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
}
