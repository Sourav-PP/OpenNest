import { Request, Response, NextFunction } from 'express';
import { ICancelConsultationUseCase } from '@/useCases/interfaces/user/data/ICancelConsultationUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { sessionMessages } from '@/shared/constants/messages/sessionMessages';

export class CancelConsultationController {
    private _cancelConsultationUseCase: ICancelConsultationUseCase;

    constructor(cancelConsultationUseCase: ICancelConsultationUseCase) {
        this._cancelConsultationUseCase = cancelConsultationUseCase;
    }

    handle = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }

            const { id } = req.params;
            const { reason } = req.body;

            console.log('id: ', id);
            console.log('reason: ', reason);

            const consultation = await this._cancelConsultationUseCase.execute(
                userId,
                id,
                reason,
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: sessionMessages.SUCCESS.CANCELLED,
                data: consultation,
            });
        } catch (error) {
            next(error);
        }
    };
}
