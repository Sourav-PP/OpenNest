import { User } from "../entities/User";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
    create(user: User): Promise<User>
    updateProfile(id: string, updates: Partial<User>): Promise<User | null>
}