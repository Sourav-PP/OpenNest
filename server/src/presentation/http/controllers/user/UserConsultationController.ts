import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { sessionMessages } from '@/shared/constants/messages/sessionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICancelConsultationUseCase } from '@/useCases/interfaces/user/data/ICancelConsultationUseCase';
import { IGetUserConsultationByIdUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationByIdUseCase';
import { IGetUserConsultationUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationsUseCase';
import { NextFunction, Request, Response } from 'express';

export class UserConsultationController {
    private _getUserConsultationsUseCase: IGetUserConsultationUseCase;
    private _getUserConsultationByIdUseCase: IGetUserConsultationByIdUseCase;
    private _cancelConsultationUseCase: ICancelConsultationUseCase;

    constructor(
        getUserConsultationsUseCase: IGetUserConsultationUseCase,
        getUserConsultationByIdUseCase: IGetUserConsultationByIdUseCase,
        cancelConsultationUseCase: ICancelConsultationUseCase,
    ) {
        this._getUserConsultationsUseCase = getUserConsultationsUseCase;
        this._getUserConsultationByIdUseCase = getUserConsultationByIdUseCase;
        this._cancelConsultationUseCase = cancelConsultationUseCase;;
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

            const result = await this._getUserConsultationsUseCase.execute({
                patientId: userId,
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

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getConsultationDetail = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this._getUserConsultationByIdUseCase.execute(id);

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

            console.log('id: ', id);
            console.log('reason: ', reason);

            const consultation = await this._cancelConsultationUseCase.execute(
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
}
