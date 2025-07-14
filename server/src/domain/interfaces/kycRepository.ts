import { IKyc } from "../entities/kyc";

export interface KycRepository {
    create(data: IKyc): Promise<IKyc>
    findByPsychologistId(psychologistId: string): Promise<IKyc | null>
    updateByPsychologistId(psychologistId: string|undefined, updateData: Partial<IKyc>): Promise<IKyc | null>
}