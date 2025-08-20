import { IGetKycForPsychologistUseCase } from '@/useCases/interfaces/admin/management/IGetKycForPsychologistUseCase';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { IKycDto } from '@/useCases/dtos/kyc';
import { AppError } from '@/domain/errors/AppError';
import { toKycDto } from '@/useCases/mappers/kycMapper';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';

export class GetKycForPsychologistUseCase implements IGetKycForPsychologistUseCase {
    private _kycRepo: IKycRepository;

    constructor(kycRepo: IKycRepository) {
        this._kycRepo = kycRepo;
    }

    async execute(psychologistId: string): Promise<IKycDto> {
        if (!psychologistId) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const entities = await this._kycRepo.findByPsychologistIdForAdmin(psychologistId);

        if (!entities) {
            throw new AppError(adminMessages.ERROR.KYC_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return toKycDto(entities.kyc, entities.psychologist, entities.user);

    }
}
