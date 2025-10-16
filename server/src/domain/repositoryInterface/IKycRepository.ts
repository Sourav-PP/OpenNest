import { Kyc } from '../entities/kyc';
import { User } from '../entities/user';
import { Psychologist } from '../entities/psychologist';
import { KycStatusFilter } from '../enums/KycEnums';
import { SortFilter } from '../enums/SortFilterEnum';

export interface IKycRepository {
    create(data: Omit<Kyc, 'id'>): Promise<Kyc>;

    findAllWithDetails(params: {
        search?: string;
        sort?: SortFilter;
        skip?: number;
        limit?: number;
        status: KycStatusFilter;
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
