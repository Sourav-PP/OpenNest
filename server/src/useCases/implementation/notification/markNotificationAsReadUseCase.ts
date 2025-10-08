import { INotificationRepository } from '@/domain/repositoryInterface/INotificationRepository';
import { IMarkNotificationAsReadUseCase } from '@/useCases/interfaces/notification/IMarkNotificationAsReadUseCase';

export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
    private _notificationRepo: INotificationRepository;

    constructor(notificationRepo: INotificationRepository) {
        this._notificationRepo = notificationRepo;
    }

    async execute(recipientId: string): Promise<void> {
        await this._notificationRepo.markAsRead(recipientId);
    }
}
