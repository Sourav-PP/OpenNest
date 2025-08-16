import { NextFunction, Request, Response } from 'express';
import { IGetPsychologistDetailsUseCase } from '@/useCases/interfaces/user/data/IGetPsychologistDetailsUseCase';
import { AppError } from '@/domain/errors/AppError';;
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetPsychologistDetailsController {
    private _getPsychologistDetails: IGetPsychologistDetailsUseCase;

    constructor(getPsychologistDetails: IGetPsychologistDetailsUseCase) {
        this._getPsychologistDetails = getPsychologistDetails;
    }

    handle = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;

            if (!userId) {
                throw new AppError(adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const data = await this._getPsychologistDetails.execute(userId);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            next(error);
        }
    };
}