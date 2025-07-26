import { Kyc } from "../entities/Kyc";

export interface IKycRepository {
    create(data: Kyc): Promise<Kyc>
    findByPsychologistId(psychologistId: string): Promise<Kyc | null>
    updateByPsychologistId(psychologistId: string|undefined, updateData: Partial<Kyc>): Promise<Kyc | null>
}