import { AppError } from '@/domain/errors/AppError';
import { INotificationRepository } from '@/domain/repositoryInterface/INotificationRepository';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { INotificationDto } from '@/useCases/dtos/notification';
import { IGetNotificationsUseCase } from '@/useCases/interfaces/notification/IGetNotificationsUseCase';
import { toNotificationDto } from '@/useCases/mappers/userMapper';

export class GetNotificationUseCase implements IGetNotificationsUseCase {
    private _notificationRepo: INotificationRepository;

    constructor(notificationRepo: INotificationRepository) {
        this._notificationRepo = notificationRepo;
    }

    async execute(recipientId: string): Promise<INotificationDto[]> {
        if (!recipientId) {
            throw new AppError(
                authMessages.ERROR.UNAUTHORIZED,
                HttpStatus.UNAUTHORIZED,
            );
        }

        const notifications =
            await this._notificationRepo.findByRecipient(recipientId);
        return notifications.map(n => toNotificationDto(n));
    }
}
