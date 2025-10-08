import { Socket } from 'socket.io';

export interface INotificationSocketHandler {
    register(socket: Socket): void;
    sendNotification(
        recipientId: string,
        notification: { id: string; message: string; type: string; consultationId?: string, read: boolean },
    ): Promise<void>;
}
