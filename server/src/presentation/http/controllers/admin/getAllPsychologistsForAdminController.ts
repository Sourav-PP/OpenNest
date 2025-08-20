import { NextFunction, Request, Response } from 'express';
import { IGetAllPsychologistsForAdminUseCase } from '@/useCases/interfaces/admin/management/IGetAllPsychologistsForAdminUseCase';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';

export class GetAllPsychologistsForAdminController {
    private _getAllPsychologistsUseCase: IGetAllPsychologistsForAdminUseCase;

    constructor(getAllPsychologistsUseCase: IGetAllPsychologistsForAdminUseCase) {
        this._getAllPsychologistsUseCase = getAllPsychologistsUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { search, sort, gender } = req.query;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllPsychologistsUseCase.execute({
                search: search as string,
                sort: sort as 'asc' | 'desc',
                gender: gender as 'Male' | 'Female',
                page,
                limit,
            });
            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_PSYCHOLOGISTS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}