import { NextFunction, Request, Response } from 'express';
import { IDeleteServiceUseCase } from '@/useCases/interfaces/admin/management/IDeleteServiceUseCase';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class DeleteServiceController {
    private _deleteServiceUseCase: IDeleteServiceUseCase;

    constructor(deleteServiceUseCase: IDeleteServiceUseCase) {
        this._deleteServiceUseCase = deleteServiceUseCase;
    }

    handle = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError(
                    adminMessages.ERROR.SERVICE_ID_REQUIRED,
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this._deleteServiceUseCase.execute(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.SERVICE_DELETED,
            });
        } catch (error) {
            next(error);
        }
    };
}
