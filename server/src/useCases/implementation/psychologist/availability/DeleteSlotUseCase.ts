import { AppError } from "../../../../domain/errors/AppError";
import { ISlotRepository } from "../../../../domain/interfaces/ISlotRepository";
import { IDeleteSlotUseCase } from "../../../interfaces/psychologist/availability/IDeleteSlotUseCase";
import { IDeleteSlotInput } from "../../../types/psychologistTypes";

export class DeleteSlotUseCase implements IDeleteSlotUseCase {
    constructor(
        private slotRepo: ISlotRepository
    ) {}

    async execute(input: IDeleteSlotInput): Promise<void> {
        const slot = await this.slotRepo.findById(input.slotId)

        console.log('slot: ', slot)

        if(!slot) {
            throw new AppError("Slot not found", 404)
        }

        if(slot.psychologistId.toString() !== input.psychologistId) {
            throw new AppError("Unauthorized", 401)
        }

        await this.slotRepo.deleteById(input.slotId)
        
    }
}