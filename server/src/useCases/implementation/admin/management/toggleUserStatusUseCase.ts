import { AppError } from '@/domain/errors/AppError';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IToggleUserStatusUseCase } from '@/useCases/interfaces/admin/management/IToggleUserStatusUseCase';

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    private _userRepo: IUserRepository;

    constructor(userRepo: IUserRepository) {
        this._userRepo = userRepo;
    }

    async execute(userId: string, status: 'active' | 'inactive'): Promise<void> {
        const user = await this._userRepo.findById(userId);
        if (!user) throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        const isActive = status === 'active';
        await this._userRepo.updateStatus(userId, isActive);
    }
}