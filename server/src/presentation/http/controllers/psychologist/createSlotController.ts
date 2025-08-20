import { NextFunction, Request, Response } from 'express';
import { ICreateSlotUseCase } from '@/useCases/interfaces/psychologist/availability/ICreateSlotUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class CreateSlotController {
    private _createSlotUseCase: ICreateSlotUseCase;

    constructor(createSlotUseCase: ICreateSlotUseCase) {
        this._createSlotUseCase = createSlotUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (req.body.startDateTime && req.body.endDateTime) {
                await this._createSlotUseCase.executeSingle({
                    userId,
                    startDateTime: new Date(req.body.startDateTime),
                    endDateTime: new Date(req.body.endDateTime),
                });
            } else {
                // console.log('body: ',JSON.stringify(req.body, null, 2));
                const { fromDate, toDate, weekDays, startTime, endTime, duration, timeZone } = req.body;

                await this._createSlotUseCase.executeRecurring({
                    userId,
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