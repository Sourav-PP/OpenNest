import { userModel } from '../../database/models/user/UserModel';
import { IAuthAccountRepository } from '../../../domain/repositoryInterface/IAuthAccountRepository';

export class UserAuthAccountRepository implements IAuthAccountRepository {
    async findById(id: string): Promise<{ id: string; role: string; email: string; } | null> {
        const user = await userModel.findById(id);
        if (!user) return null;

        return {
            id: user._id?.toString(),
            role: user.role,
            email: user.email,
        };
    }
}