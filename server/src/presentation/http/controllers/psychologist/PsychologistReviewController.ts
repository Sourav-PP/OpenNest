import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPsychologistReviewsUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistReviewsUseCase';
import { NextFunction, Request, Response } from 'express';

export class PsychologistReviewController {
    private _getPsychologistReviewsUseCase: IGetPsychologistReviewsUseCase;

    constructor(getPsychologistReviewsUseCase: IGetPsychologistReviewsUseCase) {
        this._getPsychologistReviewsUseCase = getPsychologistReviewsUseCase;
    }

    getPsychologistReviews = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { psychologistId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 2;

            const result = await this._getPsychologistReviewsUseCase.execute(psychologistId, page, limit);
            res.status(HttpStatus.OK).json({
                success: true,
                message: psychologistMessages.SUCCESS.REVIEWS_FETCHED,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}
