import { AdminModel } from '../../database/models/admin/adminModel';
import { IAuthAccountRepository } from '../../../domain/repositoryInterface/IAuthAccountRepository';
import { UserRole } from '@/domain/enums/UserEnums';

export class AdminAuthAccountRepository implements IAuthAccountRepository {
    async findById(id: string): Promise<{ id: string; role: UserRole; email: string; isActive?: boolean } | null> {
        const admin = await AdminModel.findById(id);
        if (!admin) return null;

        return {
            id: admin._id?.toString() ?? '',
            role: UserRole.ADMIN,
            email: admin.email,
        };   
    }
}