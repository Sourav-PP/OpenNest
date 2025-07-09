import { IPsychologist } from "../entities/psychologist";

export interface PsychologistRepository {
    create(psychologist: IPsychologist): Promise<IPsychologist>
    findById(psychologistId: string): Promise<IPsychologist | null>
}