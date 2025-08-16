import { NextFunction, Request, Response } from 'express';
import { CreateSlotUseCase } from '@/useCases/implementation/psychologist/availability/CreateSlotUseCase';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class CreateSlotController {
    private _createSlotUseCase: CreateSlotUseCase;
    private _psychologistRepo: IPsychologistRepository;

    constructor(createSlotUseCase: CreateSlotUseCase, psychologistRepo: IPsychologistRepository) {
        this._createSlotUseCase = createSlotUseCase;
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

            const psychologistId = psychologist.id;

            if (req.body.startDateTime && req.body.endDateTime) {
                await this._createSlotUseCase.executeSingle({
                    psychologistId,
                    startDateTime: new Date(req.body.startDateTime),
                    endDateTime: new Date(req.body.endDateTime),
                });
            } else {
                // console.log('body: ',JSON.stringify(req.body, null, 2));
                const { fromDate, toDate, weekDays, startTime, endTime, duration, timeZone } = req.body;

                await this._createSlotUseCase.executeRecurring({
                    psychologistId,
                    fromDate,
                    toDate,
                    weekDays,
                    startTime,
                    endTime,
                    duration,
                    timeZone,
                });
            }

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: psychologistMessages.SUCCESS.SLOT_CREATED,
            });
        } catch (error) {
            next(error);
        }
    };
}