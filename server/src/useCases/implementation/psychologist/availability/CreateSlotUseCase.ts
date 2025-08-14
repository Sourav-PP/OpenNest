import { RRule } from 'rrule';
import { Slot } from '../../../../domain/entities/slot';
import { AppError } from '../../../../domain/errors/AppError';
import { ISlotRepository } from '../../../../domain/interfaces/ISlotRepository';
import { ICreateSlotUseCase } from '../../../interfaces/psychologist/availability/ICreateSlotUseCase';
import { IRecurringSlotInput } from '../../../types/psychologistTypes';
import { DateTime } from 'luxon';
import { IPsychologistRepository } from '../../../../domain/interfaces/IPsychologistRepository';

export class CreateSlotUseCase implements ICreateSlotUseCase {
    constructor(
        private slotRepo: ISlotRepository,
        private psychologistRepo: IPsychologistRepository,
    ) {}

    async executeSingle(input: Slot): Promise<void> {
        const hasConflict = await this.slotRepo.checkConflict(input.psychologistId, input.startDateTime, input.endDateTime);
        if (hasConflict) throw new AppError('A conflicting slot already exists.', 409);

        await this.slotRepo.createSlot([input]);
    }

    async executeRecurring(input: IRecurringSlotInput): Promise<void> {
        const slots: Slot[] = [];
        const rule = new RRule({
            freq: RRule.WEEKLY,
            byweekday: input.weekDays,
            dtstart: new Date(input.fromDate),
            until: new Date(input.toDate),
        });

        console.log('input: ', input);

        const recurringDates = rule.all();

        console.log('recurring dates: ', recurringDates);

        if (recurringDates.length === 0) {
            throw new AppError(
                'No matching recurring dates found in the selected date range. Please check your weekday selection.',
                400,
            );
        }

        const timeZone = input.timeZone;
        if (!timeZone) {
            throw new AppError('Timezone is required for recurring slots', 400);
        }

        for ( const date of recurringDates) {
            const day = DateTime.fromJSDate(date, { zone: timeZone });


            const [startHour, startMinute] = input.startTime.split(':').map(Number);
            const [endHour, endMinute] = input.endTime.split(':').map(Number);

            let start = day.set({ hour: startHour, minute: startMinute }).toUTC();
            const end = day.set({ hour: endHour, minute: endMinute }).toUTC();

            console.log('start: ', start);
            console.log('end', end);

            while (start.plus({ minutes: input.duration }) <= end) {
                const slotEnd = start.plus({ minutes: input.duration });

                const hasConflict = await this.slotRepo.checkConflict(
                    input.psychologistId,
                    start.toJSDate(),
                    slotEnd.toJSDate(),
                );

                if (!hasConflict) {
                    slots.push({
                        psychologistId: input.psychologistId,
                        startDateTime: start.toJSDate(),
                        endDateTime: slotEnd.toJSDate(),
                    });
                } else {
                    throw new AppError('No slots were created due to conflicts', 409);
                }

                start = slotEnd;
            }

        }
        
        if (!slots.length) {
            throw new AppError('No slots were created due to conflicts or invalid inputs.', 409);
        }

        await this.slotRepo.createSlot(slots);
    }
}