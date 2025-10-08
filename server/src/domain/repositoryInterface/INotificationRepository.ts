import { Notification } from '../entities/notification';

export interface INotificationRepository {
    create(notification: Omit<Notification, 'id'>): Promise<Notification>;
    findPendingNotifications(now: Date): Promise<Notification[]>;
    markAsSent(notificationId: string): Promise<void>;
    markAsRead(): Promise<void>;
    findByRecipient(recipientId: string): Promise<Notification[]>;
}
