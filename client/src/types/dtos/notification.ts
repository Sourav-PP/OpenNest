import type { NotificationTypeValue } from '@/constants/Notification';

export interface INotificationDto {
  id: string;
  message: string;
  type: NotificationTypeValue;
  consultationId?: string | undefined;
  read: boolean;
}
