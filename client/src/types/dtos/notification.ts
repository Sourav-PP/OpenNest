import type { NotificationTypeValue } from '@/constants/types/Notification';

export interface INotificationDto {
  id: string;
  message: string;
  type: NotificationTypeValue;
  consultationId?: string | undefined;
  read: boolean;
  createdAt: Date;
  notifyAt?: Date;
}
