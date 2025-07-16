import { PsychologistRepository } from "../../../domain/interfaces/psychologistRepository";
import { IPsychologist } from "../../../domain/entities/psychologist";

export class GetAllPsychologistUseCasee {
    constructor(private psychologistRepo: PsychologistRepository) {}

    async execute(): Promise<IPsychologist[]> {
        return await this.psychologistRepo.getAllPsychologists()
    }
}