import { NotificationType } from '@/domain/enums/NotificationEnums';
import { INotificationSocketHandler } from '@/useCases/interfaces/notification/INotificationSocketHandler';
import { Server, Socket } from 'socket.io';

export class NotificationSocketHandler implements INotificationSocketHandler {
    private _io: Server;

    constructor(io: Server) {
        this._io = io;
    }

    register(socket: Socket): void {
        const userId = socket.data.userId;
        if (!userId) {
            console.warn(`Socket ${socket.id} has no userId; cannot join personal room.`);
            return;
        }

        socket.join(userId);
        console.log(`Socket ${socket.id} joined personal room: ${userId}`);
    }

    async sendNotification(
        recipientId: string,
        notification: { id: string; message: string; type: NotificationType; consultationId?: string; read: boolean, createAt?: Date, notifyAt?: Date },
    ): Promise<void> {
        this._io.to(recipientId).emit('notification', notification);
    }
}
