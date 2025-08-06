import { Slot } from "../../../../domain/entities/slot";
import { ISlotRepository } from "../../../../domain/interfaces/ISlotRepository";
import { IGetSlotByPsychologistUseCase } from "../../../interfaces/psychologist/availability/IGetSlotByPsychologistUseCase";

export class GetSlotByPsychologistUseCase implements IGetSlotByPsychologistUseCase {
    constructor(
        private slotRepo: ISlotRepository
    ) {}

    async execute(psychologistId: string): Promise<Slot[]> {
        const slots = await this.slotRepo.getSlotByPsychologistId(psychologistId)

        return slots.map(slot => ({
            id: slot.id,
            psychologistId: slot.psychologistId,
            startDateTime: slot.startDateTime,
            endDateTime: slot.endDateTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy
        }))
    }
}