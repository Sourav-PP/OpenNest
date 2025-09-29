import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetAllConsultationsUseCase } from '@/useCases/interfaces/admin/management/IGetAllConsultationsUseCase';
import { NextFunction, Request, Response } from 'express';

export class AdminConsultationController {
    private _getAllConsultationsUseCase: IGetAllConsultationsUseCase;

    constructor(getAllConsultationsUseCase: IGetAllConsultationsUseCase) {
        this._getAllConsultationsUseCase = getAllConsultationsUseCase;
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
}
