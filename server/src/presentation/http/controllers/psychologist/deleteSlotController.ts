import { NextFunction, Request, Response } from 'express';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IDeleteSlotUseCase } from '@/useCases/interfaces/psychologist/availability/IDeleteSlotUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class DeleteSlotController {
    private _deleteSlotUseCase: IDeleteSlotUseCase;
    private _psychologistRepo: IPsychologistRepository;

    constructor(
        deleteSlotUseCase: IDeleteSlotUseCase,
        psychologistRepo: IPsychologistRepository,
    ) {
        this._deleteSlotUseCase = deleteSlotUseCase;
        this._psychologistRepo = psychologistRepo;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { slotId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const psychologist = await this._psychologistRepo.findByUserId(userId);
            if (!psychologist) {
                throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            await this._deleteSlotUseCase.execute({ slotId, psychologistId: psychologist.id });

            res.status(HttpStatus.OK).json({
                success: true,
                message: psychologistMessages.SUCCESS.SLOT_DELETED,
            });
        } catch (error) {
            next(error);
        }
    };
}
