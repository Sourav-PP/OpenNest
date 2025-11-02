import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreateSlotUseCase } from '@/useCases/interfaces/psychologist/availability/ICreateSlotUseCase';
import { IDeleteSlotUseCase } from '@/useCases/interfaces/psychologist/availability/IDeleteSlotUseCase';
import { IGetSlotByPsychologistUseCase } from '@/useCases/interfaces/psychologist/availability/IGetSlotByPsychologistUseCase';
import { NextFunction, Request, Response } from 'express';

export class SlotController {
    private _createSlotUseCase: ICreateSlotUseCase;
    private _deleteSlotUseCase: IDeleteSlotUseCase;
    private _getSlotByPsychologistUseCase: IGetSlotByPsychologistUseCase;

    constructor(
        createSlotUseCase: ICreateSlotUseCase,
        deleteSlotUseCase: IDeleteSlotUseCase,
        getSlotByPsychologistUseCase: IGetSlotByPsychologistUseCase,
    ) {
        this._createSlotUseCase = createSlotUseCase;
        this._deleteSlotUseCase = deleteSlotUseCase;
        this._getSlotByPsychologistUseCase = getSlotByPsychologistUseCase;
    }

    createSlot = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
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
                    timeZone: req.body.timeZone,
                });
            } else {
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

    deleteSlot = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { slotId } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._deleteSlotUseCase.execute({ slotId, userId });

            res.status(HttpStatus.OK).json({
                success: true,
                message: psychologistMessages.SUCCESS.SLOT_DELETED,
            });
        } catch (error) {
            next(error);
        }
    };

    getSlotByPsychologist = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const slots = await this._getSlotByPsychologistUseCase.execute(userId);
            res.status(HttpStatus.OK).json(slots);
        } catch (error) {
            next(error);
        }
    };
}
