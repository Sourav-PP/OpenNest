import { NotificationType } from '../enums/NotificationEnums';

export interface INotificationService {
    send(payload: {
        recipientId: string;
        message: string;
        type: NotificationType;
        consultationId?: string;
    }): Promise<void>;
}
