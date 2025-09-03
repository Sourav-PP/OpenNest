import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetUserConsultationByIdUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationByIdUseCase';
import { NextFunction, Request, Response } from 'express';

export class GetUserConsultationDetailController {
    private _getUserConsultationByIdUseCase: IGetUserConsultationByIdUseCase;

    constructor(getUserConsultationByIdUseCase: IGetUserConsultationByIdUseCase) {
        this._getUserConsultationByIdUseCase = getUserConsultationByIdUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this._getUserConsultationByIdUseCase.execute(id);

            res.status(HttpStatus.OK).json({
                success: true,
                message: adminMessages.SUCCESS.FETCHED_CONSULTATIONS,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}
