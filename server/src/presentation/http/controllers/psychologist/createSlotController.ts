import { Request, Response } from "express";
import { CreateSlotUseCase } from "../../../../useCases/implementation/psychologist/availability/CreateSlotUseCase";
import { IPsychologistRepository } from "../../../../domain/interfaces/IPsychologistRepository";
import { RRule } from "rrule";
import { WEEKDAY_MAP } from "../../../../utils/constants";
import { AppError } from "../../../../domain/errors/AppError";

export class CreateSlotController {
    constructor(
        private createSlotUseCase: CreateSlotUseCase,
        private psychologistRepo: IPsychologistRepository
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        const userId = req.user?.userId

        if(!userId) {
           res.status(401).json({ message: 'Unauthorized' })
           return 
        }

        try {
            const psychologist = await this.psychologistRepo.findByUserId(userId)
            if(!psychologist) {
                res.status(404).json({message: "Psychologist not found"})
                return 
            }
            const psychologistId = psychologist.id!

            if(req.body.startDateTime && req.body.endDateTime) {
                await this.createSlotUseCase.executeSingle({
                    psychologistId,
                    startDateTime: new Date(req.body.startDateTime),
                    endDateTime: new Date(req.body.endDateTime)
                })
            } else {
                // console.log('body: ',JSON.stringify(req.body, null, 2));
                const {fromDate, toDate, weekDays, startTime, endTime, duration, timeZone } = req.body
                
                const rruleWeekdays = weekDays.map((day: string) => {
                    const weekday = WEEKDAY_MAP[day]
                    if(!weekday) {
                        res.status(404).json({message: `Invalid weekday: ${weekday}`})
                    }
                    return weekday
                })

                console.log("rrulesWeekdays: ", rruleWeekdays)

                await this.createSlotUseCase.executeRecurring({
                    psychologistId,
                    fromDate,
                    toDate,
                    weekDays: rruleWeekdays,
                    startTime,
                    endTime,
                    duration,
                    timeZone,
                })
            }

            console.log("slot created successfully")

            res.status(201).json({ message: 'Slot created successfully' })
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}