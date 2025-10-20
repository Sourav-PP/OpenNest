import cron from 'node-cron';
import { INotificationRepository } from '@/domain/repositoryInterface/INotificationRepository';
import { INotificationSocketHandler } from '@/useCases/interfaces/notification/INotificationSocketHandler';

export class NotificationJob {
    private _notificationRepo: INotificationRepository;
    private _notificationSocketHandler: INotificationSocketHandler;

    constructor(
        notificationRepo: INotificationRepository,
        notificationSocketHandler: INotificationSocketHandler,
    ) {
        this._notificationRepo = notificationRepo;
        this._notificationSocketHandler = notificationSocketHandler;
    }

    start(): void {
        cron.schedule('* * * * *', async() => {
            const now = new Date();

            const pendingNotifications =
                await this._notificationRepo.findPendingNotifications(now);

            for (const notification of pendingNotifications) {
                await this._notificationSocketHandler.sendNotification(
                    notification.recipientId,
                    {
                        id: notification.id,
                        message: notification.message,
                        type: notification.type,
                        consultationId: notification.consultationId,
                        read: notification.read,
                        notifyAt: notification.notifyAt,
                    },
                );

                await this._notificationRepo.markAsSent(notification.id);
            }
        });
    }
}
