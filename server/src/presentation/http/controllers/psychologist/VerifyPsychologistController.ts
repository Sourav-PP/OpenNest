import { NextFunction, Request, Response } from 'express';
import { IVerifyPsychologistUseCase } from '@/useCases/interfaces/psychologist/profile/IVerifyPsychologistUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class VerifyPsychologistController {
    private _verifyPsychologistUseCase: IVerifyPsychologistUseCase;

    constructor(verifyPsychologistUseCase: IVerifyPsychologistUseCase) {
        this._verifyPsychologistUseCase = verifyPsychologistUseCase;
    }

    handle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const data = {
                userId,
                ...req.body,
                files: req.files as Record<string, Express.Multer.File[]>,
            };

            const { psychologist, kyc } =  await this._verifyPsychologistUseCase.execute(data);

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: psychologistMessages.SUCCESS.KYC_SUBMITTED,
                data: {
                    psychologistId: psychologist.id,
                    isVerified: psychologist.isVerified,
                    kycStatus: kyc.kycStatus,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}