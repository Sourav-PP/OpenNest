import { IGetKycDetailsUseCase } from '@/useCases/interfaces/psychologist/profile/IGetKycDetailsUseCase';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { Kyc } from '@/domain/entities/kyc';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class GetKycDetailsUseCase implements IGetKycDetailsUseCase {
    private _psychologistRepo: IPsychologistRepository;
    private _kycRepo: IKycRepository;

    constructor(kycRepo: IKycRepository, psychologistRepo: IPsychologistRepository) {
        this._kycRepo = kycRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(userId: string): Promise<Kyc> {
        const psychologist = await this._psychologistRepo.findByUserId(userId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const kyc = await this._kycRepo.findByPsychologistId(psychologist.id);

        if (!kyc) {
            throw new AppError(adminMessages.ERROR.KYC_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return kyc;
    }
}
