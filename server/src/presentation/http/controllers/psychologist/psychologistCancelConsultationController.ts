import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { sessionMessages } from '@/shared/constants/messages/sessionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IPsychologistCancelConsultationUseCase } from '@/useCases/interfaces/psychologist/data/IPsychologistCancelConsultationUseCase';
import { NextFunction, Request, Response } from 'express';

export class PsychologistCancelConsultationController {
    private _psychologistCancelConsultationUseCase: IPsychologistCancelConsultationUseCase;

    constructor(
        psychologistCancelConsultationUseCase: IPsychologistCancelConsultationUseCase,
    ) {
        this._psychologistCancelConsultationUseCase =
            psychologistCancelConsultationUseCase;
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

            const consultation =
                await this._psychologistCancelConsultationUseCase.execute(
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
