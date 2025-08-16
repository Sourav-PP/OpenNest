import { NextFunction, Request, Response } from 'express';
import { ICreateServiceUseCase } from '@/useCases/interfaces/admin/management/ICreateServiceUseCase';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';

export class CreateServiceController {
    private _createServiceUseCase: ICreateServiceUseCase;

    constructor(createServiceUseCase: ICreateServiceUseCase) {
        this._createServiceUseCase = createServiceUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
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
}
