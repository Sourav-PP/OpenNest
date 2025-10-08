import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { notificationMessages } from '@/shared/constants/messages/notificationsMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetNotificationsUseCase } from '@/useCases/interfaces/notification/IGetNotificationsUseCase';
import { IMarkNotificationAsReadUseCase } from '@/useCases/interfaces/notification/IMarkNotificationAsReadUseCase';
import { NextFunction, Request, Response } from 'express';

export class NotificationController {
    private _getNotificationUseCase: IGetNotificationsUseCase;
    private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase;

    constructor(
        getNotificationUseCase: IGetNotificationsUseCase,
        markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    ) {
        this._getNotificationUseCase = getNotificationUseCase;
        this._markNotificationAsReadUseCase = markNotificationAsReadUseCase;
    }

    getNotifications = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const notifications =
                await this._getNotificationUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: notificationMessages.SUCCESS.FETCHED_SUCCESSFULLY,
                data: notifications,
            });
        } catch (error) {
            next(error);
        }
    };

    markAsRead = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._markNotificationAsReadUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: notificationMessages.SUCCESS.MARKED_AS_READ,
            });
        } catch (error) {
            next(error);
        }
    };
}
