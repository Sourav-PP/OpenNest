import { NextFunction, Request, Response } from 'express';
import { IGetAllUserUseCase } from '@/useCases/interfaces/admin/management/IGetAllUsersUseCase';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetAllUserController {
    private _getAllUserUseCase: IGetAllUserUseCase;

    constructor(getAllUserUseCase: IGetAllUserUseCase) {
        this._getAllUserUseCase = getAllUserUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await this._getAllUserUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                gender: req.query.gender as 'Male' | 'Female',
                page,
                limit,
            });

            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    };
}