import { ISlotRepository } from "../../domain/interfaces/ISlotRepository";
import { Slot } from "../../domain/entities/slot";
import { SlotModel } from "../database/models/psychologist/slotModel";

export class SlotRepository implements ISlotRepository {
    async createSlot(slots: Slot[]): Promise<void> {
        await SlotModel.insertMany(slots)
    }

    async checkConflict(psychologistId: string, start: Date, end: Date): Promise<boolean> {
        const conflict = await SlotModel.findOne({
            psychologistId,
            $or: [
                {stardDateTime: {$lt: end}, endDateTime: {$gt: start}}
            ]
        })

        return conflict !== null
    }

    async getSlotByPsychologistId(psychologistId: string): Promise<Slot[]> {
        const slots = await SlotModel.find({psychologistId}).lean()
        return slots.map((slot) => ({
            ...slot,
            id: slot._id.toString(),
            psychologistId: slot.psychologistId.toString(),
            bookedBy: slot.bookedBy?.toString() ?? null
        }))
    }

    async findById(id: string): Promise<Slot | null> {
        const slot = await SlotModel.findById(id).lean()
        if(!slot) return null

        return {
            ...slot,
            id: slot?._id.toString(),
            psychologistId: slot.psychologistId.toString(),
            bookedBy: slot.bookedBy?.toString() ?? null
        }
    }

    async deleteById(id: string): Promise<void> {
        await SlotModel.findByIdAndDelete(id)
    }
}