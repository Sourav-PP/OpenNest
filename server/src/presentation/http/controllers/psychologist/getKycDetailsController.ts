import { NextFunction, Request, Response } from 'express';
import { IGetKycDetailsUseCase } from '@/useCases/interfaces/psychologist/profile/IGetKycDetailsUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetKycDetailsController {
    private _getKycDetailsUseCase: IGetKycDetailsUseCase;

    constructor(
        getKycDetailsUseCase: IGetKycDetailsUseCase,
    ) {
        this._getKycDetailsUseCase = getKycDetailsUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const kyc = await this._getKycDetailsUseCase.execute(userId);

            res.status(HttpStatus.OK).json(kyc);
        } catch (error) {
            next(error);
        }
    };
}