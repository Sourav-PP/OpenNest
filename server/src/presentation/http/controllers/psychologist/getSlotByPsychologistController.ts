import { NextFunction, Request, Response } from 'express';
import { IGetSlotByPsychologistUseCase } from '@/useCases/interfaces/psychologist/availability/IGetSlotByPsychologistUseCase';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class GetSlotByPsychologistController {
    private _getSlotByPsychologistUseCase: IGetSlotByPsychologistUseCase;
    private _psychologistRepo: IPsychologistRepository;

    constructor(
        getSlotByPsychologistUseCase: IGetSlotByPsychologistUseCase,
        psychologistRepo: IPsychologistRepository,
    ) {
        this._getSlotByPsychologistUseCase = getSlotByPsychologistUseCase;
        this._psychologistRepo = psychologistRepo;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const psychologist = await this._psychologistRepo.findByUserId(userId);
            if (!psychologist) {
                throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const slots = await this._getSlotByPsychologistUseCase.execute(psychologist.id);
            res.status(HttpStatus.OK).json(slots);
        } catch (error) {
            next(error);
        }
    };
}