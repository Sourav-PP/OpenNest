import { AdminModel } from '../../database/models/admin/adminModel';
import { IAuthAccountRepository } from '../../../domain/repositoryInterface/IAuthAccountRepository';

export class AdminAuthAccountRepository implements IAuthAccountRepository {
    async findById(id: string): Promise<{ id: string; role: string; email: string; } | null> {
        const admin = await AdminModel.findById(id);
        if (!admin) return null;

        return {
            id: admin._id?.toString() ?? '',
            role: 'admin',
            email: admin.email,
        };   
    }
}