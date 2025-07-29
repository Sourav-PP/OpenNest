import { IPsychologistRepository } from "../../../../domain/interfaces/IPsychologistRepository";
import { Psychologist } from "../../../../domain/entities/psychologist";
import { IPsychologistResponseDto } from "../../../../domain/dtos/psychologist";

export class GetAllPsychologistUseCasee {
    constructor(private psychologistRepo: IPsychologistRepository) {}

    async execute(): Promise<IPsychologistResponseDto[]> {
        const psychologists = await this.psychologistRepo.getAllPsychologists()
        return psychologists.map(p => ({
            id: p.id,
            userId: p.userId,
            email: p.user.email,
            aboutMe: p.aboutMe,
            defaultFee: p.defaultFee,
            name: p.user.name,
            profileImage: p.user.profileImage,
            qualification: p.qualification,
            specializations: p.specializations,
            specializationFees: p.specializationFees
        }))
    }
}