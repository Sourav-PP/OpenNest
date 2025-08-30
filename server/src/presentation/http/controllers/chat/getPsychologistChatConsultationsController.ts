import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPsychologistChatConsultationsUseCase } from '@/useCases/interfaces/chat/IGetPsychologistChatConsultationsUseCase';
import { NextFunction, Request, Response } from 'express';

export class GetPsychologistChatConsultationsController {
    private _getPsychologistChatConsultationUseCase: IGetPsychologistChatConsultationsUseCase;

    constructor(getPsychologistChatConsultationUseCase: IGetPsychologistChatConsultationsUseCase) {
        this._getPsychologistChatConsultationUseCase = getPsychologistChatConsultationUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
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