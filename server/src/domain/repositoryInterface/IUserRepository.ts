import { PendingUser } from '../entities/pendingUser';
import { User } from '../entities/user';

export interface IUserRepository {
    findAll(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        gender?: 'Male' | 'Female' | 'all';
        skip: number;
        limit: number
    }): Promise<User[]>
    countAll(params: {
        search?: string;
        gender?: 'Male' | 'Female' | 'all';
    }): Promise<number>
    isUserBlocked(userId: string): Promise<boolean>
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
    createPendingSignup(user: PendingUser): Promise<void>
    findPendingSignup(email: string): Promise<Omit<User, 'isActive'> | null>
    deletePendingSignup(email: string): Promise<void>;
    create(user: Omit<User ,'id'>): Promise<User>
    updateProfile(id: string, updates: Partial<User>): Promise<User | null>
    updateStatus(id: string,isActive: boolean): Promise<void>
    updatePassword(email: string, newPassword: string): Promise<void>
}