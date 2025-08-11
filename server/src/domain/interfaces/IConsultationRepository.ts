import { Consultation } from "../entities/consultation";

export interface IConsultationRepository {
    createConsultation(data: Consultation): Promise<Consultation>
    isSlotBooked(slotId: string): Promise<boolean>
}