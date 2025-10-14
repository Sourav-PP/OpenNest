import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetAllConsultationsUseCase } from '@/useCases/interfaces/admin/management/IGetAllConsultationsUseCase';
import { IGetTopPsychologistUseCase } from '@/useCases/interfaces/admin/management/IGetTopPsychologistUseCase';
import { NextFunction, Request, Response } from 'express';

export class AdminConsultationController {
    private _getAllConsultationsUseCase: IGetAllConsultationsUseCase;
    private _getTopPsychologistsUseCase: IGetTopPsychologistUseCase;

    constructor(
        getAllConsultationsUseCase: IGetAllConsultationsUseCase,
        getTopPsychologistsUseCase: IGetTopPsychologistUseCase,
    ) {
        this._getAllConsultationsUseCase = getAllConsultationsUseCase;
        this._getTopPsychologistsUseCase = getTopPsychologistsUseCase;
    }

    getAllConsultations = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllConsultationsUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                page,
                limit,
                status: req.query.status as
                    | 'booked'
                    | 'cancelled'
                    | 'completed'
                    | 'rescheduled'
                    | 'all',
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

    getTopPsychologists = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this._getTopPsychologistsUseCase.execute(limit);
            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_PSYCHOLOGIST,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}
