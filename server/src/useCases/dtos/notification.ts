import { NotificationType } from '@/domain/enums/NotificationEnums';

export interface INotificationDto {
    id: string;
    message: string;
    type: NotificationType;
    consultationId?: string;
    read: boolean;
    createdAt?: Date,
    notifyAt?: Date,
}
