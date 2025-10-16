import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetAllServiceUseCase } from '@/useCases/interfaces/user/data/IGetAllServiceUseCase';
import { IGetAllServiceInput } from '@/useCases/types/serviceTypes';
import { NextFunction, Request, Response } from 'express';

export class UserServiceController {
    private _getAllServicesUseCase: IGetAllServiceUseCase;

    constructor(getAllServicesUseCase: IGetAllServiceUseCase) {
        this._getAllServicesUseCase = getAllServicesUseCase;
    }

    getAllService = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const input: IGetAllServiceInput = {
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
                search: req.query.search as string,
            };

            const services = await this._getAllServicesUseCase.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_SERVICES,
                data: services,
            });
        } catch (error) {
            next(error);
        }
    };
}
