import { Slot } from '../entities/slot';
import { User } from '../entities/user';

export interface ISlotRepository {
    createSlot(slots: Omit<Slot, 'id' | 'isBooked' | 'isAvailable'>[]): Promise<void>
    checkConflict(psychologistId: string, start: Date, end: Date): Promise<boolean>
    getAllSlotsByPsychologistId(psychologistId: string): Promise<Slot[]>
    getSlotByPsychologist(psychologistId: string, date: Date): Promise<{slot: Slot, user: User | null}[]>
    findById(id: string): Promise<Slot | null>
    deleteById(id: string): Promise<boolean>
    markSlotAsBooked(slotId:string, patientId: string): Promise<void>
    markSlotAsAvailable(slotId: string): Promise<void>
    markSlotAsNotAvailable(slotId: string): Promise<void>
}