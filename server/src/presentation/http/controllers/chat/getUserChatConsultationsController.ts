import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetUserChatConsultationsUseCase } from '@/useCases/interfaces/chat/IGetUserChatConsultationsUseCase';
import { NextFunction, Request, Response } from 'express';

export class GetUserChatConsultationsController {
    private _getUserChatConsultationUseCase: IGetUserChatConsultationsUseCase;

    constructor(getUserChatConsultationUseCase: IGetUserChatConsultationsUseCase) {
        this._getUserChatConsultationUseCase = getUserChatConsultationUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
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
                sort: req.query.sort as 'asc' | 'desc',
                status: req.query.status as 'booked' | 'cancelled' | 'completed' | 'rescheduled',
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