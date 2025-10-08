import { INotificationRepository } from '@/domain/repositoryInterface/INotificationRepository';
import { GenericRepository } from '../GenericRepository';
import {
    INotificationDocument,
    NotificationModel,
} from '@/infrastructure/database/models/user/NotificationModel';
import { Notification } from '@/domain/entities/notification';

export class NotificationRepository
    extends GenericRepository<Notification, INotificationDocument>
    implements INotificationRepository
{
    constructor() {
        super(NotificationModel);
    }

    async findPendingNotifications(now: Date): Promise<Notification[]> {
        const notifications = await NotificationModel.find({
            notifyAt: { $lte: now },
            sent: false,
        }).exec();
        return notifications.map(n => this.map(n));
    }

    async findByRecipient(recipientId: string): Promise<Notification[]> {
        const notifications = await NotificationModel.find({
            recipientId,
            sent: true,
        }).sort({ createdAt: -1 });
        return notifications.map(n => this.map(n));
    }

    async markAsSent(notificationId: string): Promise<void> {
        await NotificationModel.findByIdAndUpdate(notificationId, {
            sent: true,
        });
    }

    async markAsRead(recipientId: string): Promise<void> {
        await NotificationModel.updateMany(
            { recipientId, read: false },
            { $set: { read: true } },
        );
    }
}
