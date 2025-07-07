import { IUser } from "../entities/user";

export interface UserRepository {
    findByEmail(email: string): Promise<IUser | null>
    findById(userId: string): Promise<IUser | null>
    create(user: IUser): Promise<IUser>
}