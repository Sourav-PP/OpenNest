import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { sessionMessages } from '@/shared/constants/messages/sessionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPsychologistConsultationHistoryUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistConsultationHistoryUseCase';
import { IGetPsychologistConsultationUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistConsultationsUseCase';
import { IPsychologistCancelConsultationUseCase } from '@/useCases/interfaces/psychologist/data/IPsychologistCancelConsultationUseCase';
import { NextFunction, Request, Response } from 'express';

export class PsychologistConsultationController {
    private _getPsychologistConsultationUseCase: IGetPsychologistConsultationUseCase;
    private _psychologistCancelConsultationUseCase: IPsychologistCancelConsultationUseCase;
    private _getPsychologistConsultationHistoryUseCase: IGetPsychologistConsultationHistoryUseCase;

    constructor(
        getPsychologistConsultationUseCase: IGetPsychologistConsultationUseCase,
        psychologistCancelConsultationUseCase: IPsychologistCancelConsultationUseCase,
        getPsychologistConsultationHistoryUseCase: IGetPsychologistConsultationHistoryUseCase,
    ) {
        this._getPsychologistConsultationUseCase = getPsychologistConsultationUseCase;
        this._psychologistCancelConsultationUseCase =psychologistCancelConsultationUseCase;
        this._getPsychologistConsultationHistoryUseCase = getPsychologistConsultationHistoryUseCase;
    }

    getConsultations = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const result =
                await this._getPsychologistConsultationUseCase.execute({
                    psychologistId: userId,
                    search: req.query.search as string,
                    sort: req.query.sort as 'asc' | 'desc',
                    status: req.query.status as
                        | 'booked'
                        | 'cancelled'
                        | 'completed'
                        | 'rescheduled',
                    page,
                    limit,
                });

            console.log('consultations: ', result);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    cancelConsultation = async(
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

            const { id } = req.params;
            const { reason } = req.body;

            const consultation =
                await this._psychologistCancelConsultationUseCase.execute(
                    userId,
                    id,
                    reason,
                );

            res.status(HttpStatus.OK).json({
                success: true,
                message: sessionMessages.SUCCESS.CANCELLED,
                data: consultation,
            });
        } catch (error) {
            next(error);
        }
    };

    getHistory = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const result =
                await this._getPsychologistConsultationHistoryUseCase.execute({
                    psychologistId: userId,
                    search: req.query.search as string,
                    sort: req.query.sort as 'asc' | 'desc',
                    page,
                    limit,
                });

            console.log('consultations: ', result);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}
