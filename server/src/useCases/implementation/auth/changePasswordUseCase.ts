import { AppError } from '@/domain/errors/AppError';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IAuthService } from '@/domain/serviceInterface/IAuthService';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IChangePasswordUseCase } from '@/useCases/interfaces/auth/IChangePasswordUseCase';

export class ChangePasswordUseCase implements IChangePasswordUseCase {
    private _userRepo: IUserRepository;
    private _authService: IAuthService;

    constructor(userRepo: IUserRepository, authService: IAuthService) {
        this._userRepo = userRepo;
        this._authService = authService;
    }

    async execute(
        userId: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<void> {
        const user = await this._userRepo.findById(userId);
        if (!user)
            throw new AppError(
                userMessages.ERROR.NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );

        if (!user.password) {
            throw new AppError(
                authMessages.ERROR.PASSWORD_CHANGE_FAILED,
                HttpStatus.NOT_FOUND,
            );
        }

        const isMatch = await this._authService.comparePassword(
            currentPassword,
            user.password,
        );

        if (!isMatch) {
            throw new AppError(
                authMessages.ERROR.INCORRECT_CURRENT_PASSWORD,
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPassword =
            await this._authService.hashPassword(newPassword);
        await this._userRepo.updatePassword(user.email, hashedPassword);
    }
}
