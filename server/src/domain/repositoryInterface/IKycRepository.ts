import { Kyc } from '../entities/kyc';
import { User } from '../entities/user';
import { Psychologist } from '../entities/psychologist';

export interface IKycRepository {
    create(data: Omit<Kyc, 'id'>): Promise<Kyc>;

    findAll(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        skip?: number;
        limit?: number;
        status: 'pending' | 'approved' | 'rejected' | 'all';
    }): Promise<{ kyc: Kyc; psychologist: Psychologist; user: User }[]>;

    countAll(): Promise<number>;

    findByPsychologistId(psychologistId: string): Promise<Kyc | null>;

    findByPsychologistIdForAdmin(
        psychologistId: string,
    ): Promise<{ kyc: Kyc; psychologist: Psychologist; user: User } | null>;

    updateByPsychologistId(
        psychologistId: string | undefined,
        updateData: Partial<Kyc>,
    ): Promise<Kyc | null>;

    approveKyc(psychologistId: string): Promise<void>;
    
    rejectKyc(psychologistId: string, reason: string): Promise<void>;
}
