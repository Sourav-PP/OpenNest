import { Notification } from '@/domain/entities/notification';

export interface ICreateNotificationUseCase {
    execute(notification: Omit<Notification, 'id'>): Promise<Notification>;
}
