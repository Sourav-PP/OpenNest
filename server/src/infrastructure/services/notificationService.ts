import { NotificationType } from '@/domain/enums/NotificationEnums';
import { INotificationRepository } from '@/domain/repositoryInterface/INotificationRepository';
import { INotificationService } from '@/domain/serviceInterface/INotificationService';
import { ICreateNotificationUseCase } from '@/useCases/interfaces/notification/ICreateNotificationUseCase';
import { INotificationSocketHandler } from '@/useCases/interfaces/notification/INotificationSocketHandler';

export class NotificationService implements INotificationService {
    private _createNotificationUseCase: ICreateNotificationUseCase;
    private _notificationSocketHandler: INotificationSocketHandler;
    private _notificationRepo: INotificationRepository;

    constructor(
        createNotificationUseCase: ICreateNotificationUseCase,
        notificationSocketHandler: INotificationSocketHandler,
        notificationRepo: INotificationRepository,
    ) {
        this._createNotificationUseCase = createNotificationUseCase;
        this._notificationSocketHandler = notificationSocketHandler;
        this._notificationRepo = notificationRepo;
    }

    async send(payload: { recipientId: string; message: string; type: NotificationType; consultationId?: string; }): Promise<void> {
        // save in db
        const { recipientId, message, type, consultationId } = payload;
        const saved = await this._createNotificationUseCase.execute({
            recipientId,
            message,
            type,
            consultationId,
            read: false,
            sent: false,
        });

        // Emit socket notification
        await this._notificationSocketHandler.sendNotification(recipientId, {
            id: saved.id,
            message: saved.message,
            type: saved.type,
            consultationId: saved.consultationId,
            read: saved.read,
            createdAt: saved.createdAt,
        });

        await this._notificationRepo.markAsSent(saved.id);
    }
}
