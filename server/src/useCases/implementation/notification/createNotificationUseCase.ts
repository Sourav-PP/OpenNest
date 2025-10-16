import { ICreateNotificationUseCase } from '@/useCases/interfaces/notification/ICreateNotificationUseCase';
import { Notification } from '@/domain/entities/notification';
import { INotificationRepository } from '@/domain/repositoryInterface/INotificationRepository';

export class CreateNotificationUseCase implements ICreateNotificationUseCase {
    private _notificationRepo: INotificationRepository;

    constructor(notificationRepo: INotificationRepository) {
        this._notificationRepo = notificationRepo;
    }

    async execute(
        notification: Omit<Notification, 'id'>,
    ): Promise<Notification> {
        const result = await this._notificationRepo.create(notification);
        return result;
    }
}
