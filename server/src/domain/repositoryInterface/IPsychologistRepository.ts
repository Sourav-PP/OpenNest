import { Psychologist } from '../entities/psychologist';
import { User } from '../entities/user';
import { SortFilter } from '../enums/SortFilterEnum';
import { UserGender, UserGenderFilter } from '../enums/UserEnums';

export interface IPsychologistRepository {
    create(psychologist: Omit<Psychologist, 'id'>): Promise<Psychologist>
    findById(psychologistId: string): Promise<Psychologist | null>
    updateByUserId(userId: string, updateData: Partial<Psychologist>):Promise<Psychologist | null>
    updateById(id: string, updateData: Partial<Psychologist>): Promise<Psychologist | null>
    findByUserId(userId: string): Promise<Psychologist | null>
    getSpecializationNamesByIds(ids: string[]): Promise<string[]>
    findAllPsychologists(params: {
        search?: string;
        sort?: SortFilter;
        gender?: UserGenderFilter;
        expertise?: string;
        skip: number;
        limit: number
    }): Promise<{psychologist: Psychologist, user: User}[]>
    countAllPsychologist(params: {
        search?: string;
        gender?: UserGender;
    }): Promise<number>
    countAllVerified():Promise<number>
    findTopPsychologists(limit: number): Promise<{
        psychologist: Psychologist;
        user: User;
        totalConsultations: number;
    }[]>;
}