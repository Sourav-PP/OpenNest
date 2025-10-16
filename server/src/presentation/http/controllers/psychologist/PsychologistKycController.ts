import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetKycDetailsUseCase } from '@/useCases/interfaces/psychologist/profile/IGetKycDetailsUseCase';
import { IVerifyPsychologistUseCase } from '@/useCases/interfaces/psychologist/profile/IVerifyPsychologistUseCase';
import { NextFunction, Request, Response } from 'express';

export class PsychologistKycController {
    private _getKycDetailsUseCase: IGetKycDetailsUseCase;
    private _verifyPsychologistUseCase: IVerifyPsychologistUseCase;

    constructor(getKycDetailsUseCase: IGetKycDetailsUseCase, verifyPsychologistUseCase: IVerifyPsychologistUseCase) {
        this._getKycDetailsUseCase = getKycDetailsUseCase;
        this._verifyPsychologistUseCase = verifyPsychologistUseCase;
    }

    getKycDetails = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const kyc = await this._getKycDetailsUseCase.execute(userId);

            res.status(HttpStatus.OK).json(kyc);
        } catch (error) {
            next(error);
        }
    };

    verifyPsychologist = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
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

            const { psychologist, kyc } = await this._verifyPsychologistUseCase.execute(data);

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
