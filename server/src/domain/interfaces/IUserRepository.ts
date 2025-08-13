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
    isUserBlocked(userId: string): Promise<boolean>
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
    createPendingSignup(user: User): Promise<void>
    findPendingSignup(email: string): Promise<User | null>
    deletePendingSignup(email: string): Promise<void>;
    create(user: User): Promise<User>
    updateProfile(id: string, updates: Partial<User>): Promise<User | null>
    updateStatus(id: string,isActive: boolean): Promise<void>
}