import { NotificationType } from '@/domain/enums/NotificationEnums';
import { AppError } from '@/domain/errors/AppError';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { INotificationService } from '@/domain/serviceInterface/INotificationService';
import { ITokenBlacklistService } from '@/domain/serviceInterface/ITokenBlacklistService';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IToggleUserStatusUseCase } from '@/useCases/interfaces/admin/management/IToggleUserStatusUseCase';

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
    private _userRepo: IUserRepository;
    private _tokenBlacklistService: ITokenBlacklistService;
    private _getNotificationService: () => INotificationService;

    constructor(userRepo: IUserRepository, tokenBlacklistService: ITokenBlacklistService, getNotificationService: () => INotificationService) {
        this._userRepo = userRepo;
        this._tokenBlacklistService = tokenBlacklistService;
        this._getNotificationService = getNotificationService;
    }

    async execute(userId: string, status: 'active' | 'inactive'): Promise<void> {
        const user = await this._userRepo.findById(userId);
        if (!user) throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        const isActive = status === 'active';
        await this._userRepo.updateStatus(userId, isActive);

        if (!isActive) {
            const ttl = 5 * 60;
            await this._tokenBlacklistService.blackListUser(userId, ttl);
        } else {
            await this._tokenBlacklistService.removeBlockedUser(userId);
        }

        const notificationService = this._getNotificationService();

        await notificationService.send({
            recipientId: userId,
            message: isActive
                ? userMessages.SUCCESS.ACCOUNT_ACTIVATED
                : userMessages.SUCCESS.ACCOUNT_DEACTIVATED,
            type: isActive
                ? NotificationType.ACCOUNT_ACTIVATED
                : NotificationType.ACCOUNT_DEACTIVATED,
        });
    }
}
