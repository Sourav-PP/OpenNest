import { NextFunction, Request, Response } from 'express';
import { IGetKycForPsychologistUseCase } from '@/useCases/interfaces/admin/management/IGetKycForPsychologistUseCase';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetKycForPsychologistController {
    private _getKycForPsychologistUseCase: IGetKycForPsychologistUseCase;

    constructor(getKycForPsychologistUseCase: IGetKycForPsychologistUseCase) {
        this._getKycForPsychologistUseCase = getKycForPsychologistUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const psychologistId = req.params.psychologistId as string;
   
            if (!psychologistId) {
                throw new AppError( adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const kyc = await this._getKycForPsychologistUseCase.execute(psychologistId);

            res.status(HttpStatus.OK).json(kyc);
        } catch (error) {
            next(error);
        }
    };
}
