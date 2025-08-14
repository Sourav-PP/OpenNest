import { Psychologist } from '../entities/psychologist';
import { IPsychologistListDto } from '../dtos/psychologist';

export interface IPsychologistRepository {
    create(psychologist: Psychologist): Promise<Psychologist>
    findById(psychologistId: string): Promise<Psychologist | null>
    updateByUserId(userId: string, updateData: Partial<Psychologist>):Promise<Psychologist | null>
    updateById(id: string, updateData: Partial<Psychologist>): Promise<Psychologist | null>
    findByUserId(userId: string): Promise<Psychologist | null>
    getSpecializationNamesByIds(ids: string[]): Promise<string[]>
    getAllPsychologists(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        gender?: 'Male' | 'Female' | 'all';
        expertise?: string;
        skip: number;
        limit: number;
    }): Promise<IPsychologistListDto[]>
    findAllPsychologists(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        gender?: 'Male' | 'Female';
        skip: number;
        limit: number
    }): Promise<IPsychologistListDto[]>
    countAllPsychologist(params: {
        search?: string;
        gender?: 'Male' | 'Female';
    }): Promise<number>
    countAllVerified():Promise<number>
}