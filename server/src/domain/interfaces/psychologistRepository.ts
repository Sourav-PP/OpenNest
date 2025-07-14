import { IPsychologist } from "../entities/psychologist";

export interface PsychologistRepository {
    create(psychologist: IPsychologist): Promise<IPsychologist>
    findById(psychologistId: string): Promise<IPsychologist | null>
    updateByUserId(userId: string, updateData: Partial<IPsychologist>):Promise<IPsychologist | null>
    findByUserId(userId: string): Promise<IPsychologist | null>
}