import { IConsultationRepository } from "../../../../domain/interfaces/IConsultationRepository";
import { ISlotRepository } from "../../../../domain/interfaces/ISlotRepository";
import { IBookConsultationUseCase } from "../../../interfaces/user/data/IBookConsultationUseCase";
import { AppError } from "../../../../domain/errors/AppError";
import { IConsultationBookingInput } from "../../../types/consultaionTypes";

export class BookConsultationUseCase implements IBookConsultationUseCase {
    constructor(
        private consultationRepo: IConsultationRepository,
        private slotRepo: ISlotRepository
    ) {}

    async execute(input: IConsultationBookingInput): Promise<void> {
        const { slotId, patientId, psychologistId, sessionGoal, issue } = input

        const slot = await this.slotRepo.findById(slotId)
        if(!slot) {
            throw new AppError("Slot not found", 409)
        }

        if(slot.isBooked) {
            throw new AppError("Slot is already booked", 409 )
        }

        const alreadyBooked = await this.consultationRepo.isSlotBooked(slotId)
        if(alreadyBooked) {
            throw new AppError("Slot is already booked", 409)
        }

        const consultation = await this.consultationRepo.createConsultation({
            ...input,
            startDateTime: slot.startDateTime,
            endDateTime: slot.endDateTime,
            status: "booked",
            includedInPayout: false
        })

        // update slot after booking
        await this.slotRepo.markSlotAsBooked(slotId, patientId)
    }
}