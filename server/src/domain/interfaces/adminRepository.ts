import { IAdmin } from "../entities/admin";

export interface AdminRepository {
    findByEmail(email: string): Promise<IAdmin | null>
}