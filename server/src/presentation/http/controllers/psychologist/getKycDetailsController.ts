import { NextFunction, Request, Response } from 'express';
import { IGetKycDetailsUseCase } from '@/useCases/interfaces/psychologist/profile/IGetKycDetailsUseCase';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class GetKycDetailsController {
    private _getKycDetailsUseCase: IGetKycDetailsUseCase;
    private _psychologistRepo: IPsychologistRepository;

    constructor(
        getKycDetailsUseCase: IGetKycDetailsUseCase,
        psychologistRepo: IPsychologistRepository,
    ) {
        this._getKycDetailsUseCase = getKycDetailsUseCase;
        this._psychologistRepo = psychologistRepo;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const psychologist = await this._psychologistRepo.findByUserId(userId);

            if (!psychologist || !psychologist.id) {
                throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const kyc = await this._getKycDetailsUseCase.execute(psychologist.id);

            res.status(HttpStatus.OK).json(kyc);
        } catch (error) {
            next(error);
        }
    };
}