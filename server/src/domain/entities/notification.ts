import { NotificationType } from '../enums/NotificationEnums';

export interface Notification {
    id: string;
    senderId?: string;
    recipientId: string;
    consultationId?: string;
    type: NotificationType;
    message: string;
    read: boolean;
    notifyAt: Date;
    sent: boolean;
    createdAt?: Date;
}
