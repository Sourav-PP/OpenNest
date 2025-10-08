import { INotificationDto } from '@/useCases/dtos/notification';

export interface IGetNotificationsUseCase {
    execute(recipientId: string): Promise<INotificationDto[]>;
}
