import { IUserRepository } from '../../../../domain/interfaces/IUserRepository';
import { IToggleUserStatusUseCase } from '../../../interfaces/admin/management/IToggleUserStatusUseCase';

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(userId: string, status: 'active' | 'inactive'): Promise<void> {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new Error('User not found');

        const isActive = status === 'active';
        await this.userRepo.updateStatus(userId, isActive);
    }
}