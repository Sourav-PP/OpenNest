import { NextFunction, Request, Response } from 'express';
import { IToggleUserStatusUseCase } from '@/useCases/interfaces/admin/management/IToggleUserStatusUseCase';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { userMessages } from '@/shared/constants/messages/userMessages';

export class ToggleUserStatusController {
    private _toggleUserStatusUseCase: IToggleUserStatusUseCase;

    constructor(toggleUserStatusUseCase: IToggleUserStatusUseCase) {
        this._toggleUserStatusUseCase = toggleUserStatusUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.userId;
            const { status } = req.body;

            console.log('status: : ', status);
    
            if (!['active', 'inactive'].includes(status)) {
                throw new AppError(generalMessages.ERROR.INVALID_STATUS, HttpStatus.BAD_REQUEST);
            }

            await this._toggleUserStatusUseCase.execute(userId, status);

            res.status(HttpStatus.OK).json({
                success: true,
                message: userMessages.SUCCESS.USER_STATUS_UPDATED,
            });
            return; 
        } catch (error) {
            next(error);
        }
    };
}