import { IRejectKycUseCase } from '@/useCases/interfaces/admin/management/IRejectKycUseCase';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class RejectKycUseCase implements IRejectKycUseCase {
    private _kycRepo: IKycRepository;
    private _psychologistRepo: IPsychologistRepository; 

    constructor(
        kycRepo: IKycRepository,
        psychologistRepo: IPsychologistRepository,
    ) {
        this._kycRepo = kycRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(psychologistId: string, reason: string): Promise<void> {
        if (!psychologistId) {
            throw new AppError(adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        await this._kycRepo.rejectKyc(psychologistId, reason);

        await this._psychologistRepo.updateById(psychologistId, {
            isVerified: false,
        });
    }
}