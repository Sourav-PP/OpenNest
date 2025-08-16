import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { IGetUserConsultationUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationsUseCase';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { authMessages } from '@/shared/constants/messages/authMessages';



export class GetUserConsultationsController {
    private _getUserConsultationsUseCase: IGetUserConsultationUseCase;

    constructor(getUserConsultationsUseCase: IGetUserConsultationUseCase) {
        this._getUserConsultationsUseCase = getUserConsultationsUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }   

            const result = await this._getUserConsultationsUseCase.execute({
                patientId: userId,
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                status: req.query.status as 'booked' | 'cancelled' | 'completed' | 'rescheduled',
                page,
                limit,
            });

            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    };
}