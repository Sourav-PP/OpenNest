import { Admin } from '../entities/admin';

export interface IAdminRepository {
    findByEmail(email: string): Promise<Admin | null>
}