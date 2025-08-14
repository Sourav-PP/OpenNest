import { Slot } from '../entities/slot';
import { ISlotDto } from '../dtos/slot';

export interface ISlotRepository {
    createSlot(slots: Slot[]): Promise<void>
    checkConflict(psychologistId: string, start: Date, end: Date): Promise<boolean>
    getSlotByPsychologistId(psychologistId: string): Promise<Slot[]>
    getSlotByPsychologist(psychologistId: string, date: Date): Promise<ISlotDto[]>
    findById(id: string): Promise<Slot | null>
    deleteById(id: string): Promise<void>
    markSlotAsBooked(slotId:string, patientId: string): Promise<void>
}