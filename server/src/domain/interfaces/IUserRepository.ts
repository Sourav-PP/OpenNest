import { User } from "../entities/user";

export interface IUserRepository {
    findAll(params: {
        search?: string;
        sort?: "asc" | "desc";
        gender?: "Male" | "Female";
        skip: number;
        limit: number
    }): Promise<User[]>
    countAll(params: {
        search?: string;
        gender?: 'Male' | 'Female';
    }): Promise<number>
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
    create(user: User): Promise<User>
    updateProfile(id: string, updates: Partial<User>): Promise<User | null>
}