import { NextFunction, Request, Response } from 'express';
import { IGetAllServiceUseCase } from '@/useCases/interfaces/user/data/IGetAllServiceUseCase';
import { IGetAllServiceInput } from '@/useCases/types/serviceTypes';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetAllServicesController {
    private _getAllServicesUseCase: IGetAllServiceUseCase;

    constructor(getAllServicesUseCase: IGetAllServiceUseCase) {
        this._getAllServicesUseCase = getAllServicesUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const input: IGetAllServiceInput = {
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
            };

            const output = await this._getAllServicesUseCase.execute(input);
            
            res.status(HttpStatus.OK).json(output);
        } catch (error) {
            next(error);
        }
    };
}