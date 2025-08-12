import { IGetUserConsultationUseCase } from "../../../interfaces/user/data/IGetUserConsultationsUseCase";
import { IConsultationRepository } from "../../../../domain/interfaces/IConsultationRepository";
import { IGetConsultationsRequest, IGetConsultationsResponse } from "../../../types/userTypes";

export class GetUserConsultationsUseCase implements IGetUserConsultationUseCase {
    constructor(
        private consultationRepo: IConsultationRepository
    ) {}

    async execute(input: IGetConsultationsRequest): Promise<IGetConsultationsResponse> {
        const {search, sort, status, page = 1, limit = 10} = input

        const finalSort = (sort === "asc" || sort === "desc") ? sort : "desc"
        const skip = (page - 1) * limit
        const userId = input.patientId

        const consultations = await this.consultationRepo.findByPatientId(userId, {
            search,
            sort: finalSort,
            limit,
            status,
            skip,
        })

        const mappedConsultations = consultations.map(c => ({
            id: c.id,
            patientId: c.patientId,
            startDateTime: c.startDateTime,
            endDateTime: c.endDateTime,
            sessionGoal: c.sessionGoal,
            status: c.status,
            meetingLink: c.meetingLink,
            psychologist: c.psychologist
        }))

        const totalCount = await this.consultationRepo.countAllByPatientId(userId)
        console.log("totlcount of consultation: ", totalCount)
        return {
            consultations: mappedConsultations,
            totalCount
        }
    }
}