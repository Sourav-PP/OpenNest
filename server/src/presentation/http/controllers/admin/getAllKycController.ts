import { NextFunction, Request, Response } from 'express';
import { IGetAllKycUseCase } from '../../../../useCases/interfaces/admin/management/IGetAllKycUseCase';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetAllKycController {
    private _getAllKycUseCase: IGetAllKycUseCase;

    constructor(getAllKycUseCase: IGetAllKycUseCase) {
        this._getAllKycUseCase = getAllKycUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllKycUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                status: req.query.status as 'pending' | 'approved' | 'rejected' | 'all',
                page,
                limit,
            });
            
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    };
}
