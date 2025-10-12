import { ClientSession } from 'mongoose';
import { PayoutRequest } from '../entities/payoutRequest';
import { User } from '../entities/user';

export interface IPayoutRequestRepository {
    create(payoutRequest: Omit<PayoutRequest, 'id'>): Promise<PayoutRequest>;
    findById(id: string): Promise<PayoutRequest | null>;
    findByPsychologistId(
        psychologistId: string,
        params?: {
            sort?: 'asc' | 'desc';
            skip?: number;
            limit?: number;
        },
    ): Promise<PayoutRequest[]>;
    getTotalCountByPsychologistId(
        psychologistId: string,
    ): Promise<number>;
    findAll(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        skip: number;
        limit: number;
    }): Promise<PayoutRequest[]>;
    findAllWithPsychologist(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        skip: number;
        limit: number;
    }): Promise<{ payoutRequest: PayoutRequest; psychologist: User }[]>;
    countAll(params: { search?: string }): Promise<number>;
    updateStatus(
        id: string,
        status: 'approved' | 'rejected',
        date: Date,
        session?: ClientSession,
    ): Promise<PayoutRequest | null>;
    deleteById(id: string): Promise<boolean>;
}
