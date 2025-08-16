import { Psychologist } from '../entities/psychologist';
import { User } from '../entities/user';

export interface IPsychologistRepository {
    create(psychologist: Omit<Psychologist, 'id'>): Promise<Psychologist>
    findById(psychologistId: string): Promise<Psychologist | null>
    updateByUserId(userId: string, updateData: Partial<Psychologist>):Promise<Psychologist | null>
    updateById(id: string, updateData: Partial<Psychologist>): Promise<Psychologist | null>
    findByUserId(userId: string): Promise<Psychologist | null>
    getSpecializationNamesByIds(ids: string[]): Promise<string[]>
    findAllPsychologists(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        gender?: 'Male' | 'Female' | 'all';
        expertise?: string;
        skip: number;
        limit: number
    }): Promise<{psychologist: Psychologist, user: User}[]>
    countAllPsychologist(params: {
        search?: string;
        gender?: 'Male' | 'Female';
    }): Promise<number>
    countAllVerified():Promise<number>
}