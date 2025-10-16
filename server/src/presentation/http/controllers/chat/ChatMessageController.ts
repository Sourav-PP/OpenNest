import { ConsultationStatusFilter } from '@/domain/enums/ConsultationEnums';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetHistoryUseCase } from '@/useCases/interfaces/chat/IGetHistoryUseCase';
import { IGetPsychologistChatConsultationsUseCase } from '@/useCases/interfaces/chat/IGetPsychologistChatConsultationsUseCase';
import { IGetUnreadCountUseCase } from '@/useCases/interfaces/chat/IGetUnreadCountUseCase';
import { IGetUserChatConsultationsUseCase } from '@/useCases/interfaces/chat/IGetUserChatConsultationsUseCase';
import { IMarkReadUseCase } from '@/useCases/interfaces/chat/IMarkReadUseCase';
import { ISendMessageUseCase } from '@/useCases/interfaces/chat/ISendMessageUseCase';
import { NextFunction, Request, Response } from 'express';

export class ChatMessageController {
    private _sendMessageUseCase: ISendMessageUseCase;
    private _getHistoryUseCase: IGetHistoryUseCase;
    private _getUnreadCountUseCase: IGetUnreadCountUseCase;
    private _markAsReadUseCase: IMarkReadUseCase;
    private _getUserChatConsultationUseCase: IGetUserChatConsultationsUseCase;
    private _getPsychologistChatConsultationUseCase: IGetPsychologistChatConsultationsUseCase;

    constructor(
        sendMessageUseCase: ISendMessageUseCase,
        getHistoryUseCase: IGetHistoryUseCase,
        getUnreadCountUseCase: IGetUnreadCountUseCase,
        markAsReadUseCase: IMarkReadUseCase,
        getUserChatConsultationUseCase: IGetUserChatConsultationsUseCase,
        getPsychologistChatConsultationUseCase: IGetPsychologistChatConsultationsUseCase,
    ) {
        this._sendMessageUseCase = sendMessageUseCase;
        this._getHistoryUseCase = getHistoryUseCase;
        this._getUnreadCountUseCase = getUnreadCountUseCase;
        this._markAsReadUseCase = markAsReadUseCase;
        this._getUserChatConsultationUseCase = getUserChatConsultationUseCase;
        this._getPsychologistChatConsultationUseCase = getPsychologistChatConsultationUseCase;
    }

    send = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const message = await this._sendMessageUseCase.execute(req.body);

            res.status(HttpStatus.OK).json({
                success: true,
                message: chatMessages.SUCCESS.SENT,
                data: message,
            });
        } catch (error) {
            next(error);
        }
    };

    getHistory = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.params.consultationId) {
                throw new AppError(bookingMessages.ERROR.CONSULTATION_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }
            const messages = await this._getHistoryUseCase.execute(req.params.consultationId);

            res.status(HttpStatus.OK).json({
                success: true,
                messages: chatMessages.SUCCESS.HISTORY_FETCHED,
                data: {
                    messages,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    getUnreadCount = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const { consultationId } = req.params;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const count = await this._getUnreadCountUseCase.execute(consultationId, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: chatMessages.SUCCESS.UNREAD_COUNT_FETCHED,
                data: count,
            });
        } catch (error) {
            next(error);
        }
    };

    markAsRead = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const { consultationId } = req.params;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            await this._markAsReadUseCase.execute(consultationId, userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: chatMessages.SUCCESS.MARKED_AS_READ,
            });
        } catch (error) {
            next(error);
        }
    };

    getUserChatConsultations = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const result = await this._getUserChatConsultationUseCase.execute({
                patientId: userId,
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                status: req.query.status as ConsultationStatusFilter,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: chatMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getPsychologistChatConsultations = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const result = await this._getPsychologistChatConsultationUseCase.execute({
                psychologistId: userId,
                search: req.query.search as string,
                sort: req.query.sort as SortFilter,
                status: req.query.status as ConsultationStatusFilter,
                page,
                limit,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: chatMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}
