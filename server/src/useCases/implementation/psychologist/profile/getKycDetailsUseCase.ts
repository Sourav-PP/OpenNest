import { IGetKycDetailsUseCase } from '@/useCases/interfaces/psychologist/profile/IGetKycDetailsUseCase';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { Kyc } from '@/domain/entities/kyc';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetKycDetailsUseCase implements IGetKycDetailsUseCase {
    private _kycRepo: IKycRepository;

    constructor(kycRepo: IKycRepository) {
        this._kycRepo = kycRepo;
    }

    async execute(psychologistId: string): Promise<Kyc> {
        const kyc = await this._kycRepo.findByPsychologistId(psychologistId);

        if (!kyc) {
            throw new AppError(adminMessages.ERROR.KYC_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return kyc;
    }
}