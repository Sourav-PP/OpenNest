import { Consultation } from "../../../domain/entities/consultation";
import { IConsultationRepository } from "../../../domain/interfaces/IConsultationRepository";
import { ConsultationModel } from "../../database/models/user/Consultation";

export class ConsultationRepository implements IConsultationRepository {
    async createConsultation(data: Consultation): Promise<Consultation> {
        const createdConsultation = await ConsultationModel.create(data)
        const consultationObj = createdConsultation.toObject();

        return {
            ...consultationObj,
            patientId: consultationObj.patientId.toString(),
            psychologistId: consultationObj.psychologistId.toString(),
            subscriptionId: consultationObj.subscriptionId?.toString(),
            slotId: consultationObj.slotId.toString(),
            issue: consultationObj.issue?.map(i => i.toString()),
            id: consultationObj._id.toString(),
        }
    }

    async isSlotBooked(slotId: string): Promise<boolean> {
        const existing = await ConsultationModel.findOne({slotId, status: 'booked'})

        return existing ? true : false
    }
}