import { RRule, Weekday } from 'rrule';
import { AppError } from '@/domain/errors/AppError';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { ICreateSlotUseCase } from '@/useCases/interfaces/psychologist/availability/ICreateSlotUseCase';
import { IRecurringSlotInput, ISingleSlotInput } from '@/useCases/types/psychologistTypes';
import { DateTime } from 'luxon';
import { ICreateSlotDto } from '@/useCases/dtos/slot';
import { WEEKDAY_MAP } from '@/utils/constants';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { Slot } from '@/domain/entities/slot';

export class CreateSlotUseCase implements ICreateSlotUseCase {
    private _slotRepo: ISlotRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(slotRepo: ISlotRepository, psychologistRepo: IPsychologistRepository) {
        this._slotRepo = slotRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async executeSingle(input: ISingleSlotInput): Promise<void> {
        const psychologist = await this._psychologistRepo.findByUserId(input.userId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (!psychologist.id || !input.startDateTime || !input.endDateTime) {
            throw new AppError(psychologistMessages.ERROR.INVALID_INPUT_SINGLE, HttpStatus.BAD_REQUEST);
        }

        console.log('startDateTime: ', input.startDateTime);
        console.log('endDateTime: ', input.endDateTime);

        const startUTC = DateTime.fromJSDate(input.startDateTime, { zone: input.timeZone || 'UTC' }).toUTC();
        const endUTC = DateTime.fromJSDate(input.endDateTime, { zone: input.timeZone || 'UTC' }).toUTC();

        const hasConflict = await this._slotRepo.checkConflict(
            psychologist.id,
            startUTC.toJSDate(),
            endUTC.toJSDate(),
        );

        if (hasConflict) throw new AppError(psychologistMessages.ERROR.CONFLICT_SINGLE, HttpStatus.CONFLICT);

        console.log('startDateTime (received from frontend):', input.startDateTime);
        console.log('startDateTime (parsed UTC):', startUTC.toISO());

        const createSlotInput: Omit<Slot, 'id' | 'isBooked' | 'isAvailable'> = {
            psychologistId: psychologist.id,
            startDateTime: startUTC.toJSDate(),
            endDateTime: endUTC.toJSDate(),
        };

        await this._slotRepo.createSlot([createSlotInput]);
    }

    async executeRecurring(input: IRecurringSlotInput): Promise<void> {
        const slots: ICreateSlotDto[] = [];

        const { duration, endTime, fromDate, userId, startTime, timeZone, toDate, weekDays } = input;

        const psychologist = await this._psychologistRepo.findByUserId(userId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (!psychologist.id || !fromDate || !toDate || !weekDays || !startTime || !endTime || !duration) {
            throw new AppError(psychologistMessages.ERROR.INVALID_INPUT_RECURRING, HttpStatus.BAD_REQUEST);
        }

        if (new Date(fromDate) >= new Date(toDate)) {
            throw new AppError(psychologistMessages.ERROR.FROM_AFTER_TO, HttpStatus.BAD_REQUEST);
        }

        const rruleWeekdays: Weekday[] = weekDays.map((day: string) => {
            const weekday = WEEKDAY_MAP[day];
            if (!weekday) {
                if (!weekday)
                    throw new AppError(psychologistMessages.ERROR.INVALID_WEEKDAY(day), HttpStatus.BAD_REQUEST);
            }
            return weekday;
        });

        const rule = new RRule({
            freq: RRule.WEEKLY,
            byweekday: rruleWeekdays,
            dtstart: new Date(input.fromDate),
            until: new Date(input.toDate),
        });

        const recurringDates = rule.all();

        if (recurringDates.length === 0) {
            throw new AppError(psychologistMessages.ERROR.NO_RECURRING_DATES, HttpStatus.BAD_REQUEST);
        }

        for (const date of recurringDates) {
            const day = DateTime.fromJSDate(date, { zone: timeZone });

            const [startHour, startMinute] = input.startTime.split(':').map(Number);
            const [endHour, endMinute] = input.endTime.split(':').map(Number);

            let start = day.set({ hour: startHour, minute: startMinute }).toUTC();
            const end = day.set({ hour: endHour, minute: endMinute }).toUTC();

            while (start.plus({ minutes: input.duration }) <= end) {
                const slotEnd = start.plus({ minutes: input.duration });

                const hasConflict = await this._slotRepo.checkConflict(
                    psychologist.id,
                    start.toJSDate(),
                    slotEnd.toJSDate(),
                );

                if (!hasConflict) {
                    slots.push({
                        psychologistId: psychologist.id,
                        startDateTime: start.toJSDate(),
                        endDateTime: slotEnd.toJSDate(),
                    });
                } else {
                    throw new AppError(psychologistMessages.ERROR.CONFLICT_RECURRING, HttpStatus.BAD_REQUEST);
                }

                start = slotEnd;
            }
        }

        if (!slots.length) {
            throw new AppError(psychologistMessages.ERROR.NO_VALID_SLOTS, HttpStatus.CONFLICT);
        }

        await this._slotRepo.createSlot(slots);
    }
}
