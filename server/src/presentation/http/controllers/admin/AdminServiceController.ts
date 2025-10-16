import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreateServiceUseCase } from '@/useCases/interfaces/admin/management/ICreateServiceUseCase';
import { IDeleteServiceUseCase } from '@/useCases/interfaces/admin/management/IDeleteServiceUseCase';
import { NextFunction, Request, Response } from 'express';

export class AdminServiceController {
    private _createServiceUseCase: ICreateServiceUseCase;
    private _deleteServiceUseCase: IDeleteServiceUseCase;

    constructor(createServiceUseCase: ICreateServiceUseCase, deleteServiceUseCase: IDeleteServiceUseCase) {
        this._createServiceUseCase = createServiceUseCase;
        this._deleteServiceUseCase = deleteServiceUseCase;
    }

    create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description } = req.body;
            const file = req.file;

            if (!file) {
                throw new AppError(adminMessages.ERROR.SERVICE_BANNER_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const service = await this._createServiceUseCase.execute({
                name,
                description,
                file,
            });

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: adminMessages.SUCCESS.SERVICE_CREATED,
                data: service,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { serviceId } = req.params;
            if (!serviceId) {
                throw new AppError(adminMessages.ERROR.SERVICE_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            await this._deleteServiceUseCase.execute(serviceId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.SERVICE_DELETED,
            });
        } catch (error) {
            next(error);
        }
    };
}
