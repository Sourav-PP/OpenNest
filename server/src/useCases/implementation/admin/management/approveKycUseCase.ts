import { IApproveKycUseCase } from '@/useCases/interfaces/admin/management/IApproveKycUseCase';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class ApproveKycUseCase implements IApproveKycUseCase {
    private _kycRepo: IKycRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(kycRepo: IKycRepository, psychologistRepo: IPsychologistRepository) {
        this._kycRepo = kycRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(psychologistId: string): Promise<void> {
        if (!psychologistId) {
            throw new AppError(adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        await this._kycRepo.approveKyc(psychologistId);

        await this._psychologistRepo.updateById(psychologistId, {
            isVerified: true,
        });
    }
}
