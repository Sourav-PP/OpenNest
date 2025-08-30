import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { IGetPsychologistConsultationUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistConsultationsUseCase';



export class GetPsychologistConsultationsController {
    private _getPsychologistConsultationUseCase: IGetPsychologistConsultationUseCase;

    constructor(getPsychologistConsultationUseCase: IGetPsychologistConsultationUseCase) {
        this._getPsychologistConsultationUseCase = getPsychologistConsultationUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }   

            const result = await this._getPsychologistConsultationUseCase.execute({
                psychologistId: userId,
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                status: req.query.status as 'booked' | 'cancelled' | 'completed' | 'rescheduled',
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