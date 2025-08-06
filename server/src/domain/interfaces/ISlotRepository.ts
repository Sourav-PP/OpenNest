import { Slot } from "../entities/slot";

export interface ISlotRepository {
    createSlot(slots: Slot[]): Promise<void>
    checkConflict(psychologistId: string, start: Date, end: Date): Promise<boolean>
    getSlotByPsychologistId(psychologistId: string): Promise<Slot[]>
}