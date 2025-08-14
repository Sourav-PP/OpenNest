import { IKycDto } from '../dtos/kyc';
import { Kyc } from '../entities/kyc';

export interface IKycRepository {
    create(data: Kyc): Promise<Kyc>
    findAll(params: {
        search?: string,
        sort?:'asc' | 'desc',
        skip?: number,
        limit?: number,
        status: 'pending' | 'approved' | 'rejected' | 'all';
    }): Promise<IKycDto[]>
    countAll(): Promise<number>
    findByPsychologistId(psychologistId: string): Promise<Kyc | null>
    findByPsychologistIdForAdmin(psychologistId: string): Promise<IKycDto | null>
    updateByPsychologistId(psychologistId: string|undefined, updateData: Partial<Kyc>): Promise<Kyc | null>
    approveKyc(psychologistId: string): Promise<void>;
    rejectKyc(psychologistId: string, reason: string): Promise<void>;
}