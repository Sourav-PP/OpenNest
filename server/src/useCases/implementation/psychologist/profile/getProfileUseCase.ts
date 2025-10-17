import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { AppError } from '@/domain/errors/AppError';
import { toPsychologistProfileDto } from '@/useCases/mappers/psychologistMapper';
import { IGetProfileUseCase } from '@/useCases/interfaces/psychologist/profile/IGetProfileUseCase';
import { IPsychologistProfileDto } from '@/useCases/dtos/psychologist';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class GetProfileUseCase implements IGetProfileUseCase {
    private _psychologistRepo: IPsychologistRepository;
    private _kycRepo: IKycRepository;
    private _userRepo: IUserRepository;

    constructor(psychologistRepo: IPsychologistRepository, kycRepo: IKycRepository, userRepo: IUserRepository) {
        this._psychologistRepo = psychologistRepo;
        this._kycRepo = kycRepo;
        this._userRepo = userRepo;
    }

    async execute(userId: string): Promise<IPsychologistProfileDto> {
        const user = await this._userRepo.findById(userId);

        if (!user) throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        const psychologist = await this._psychologistRepo.findByUserId(userId);
        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        const specializationNames = await this._psychologistRepo.getSpecializationNamesByIds(
            psychologist.specializations,
        );

        const kyc = await this._kycRepo.findByPsychologistId(psychologist.id);

        return toPsychologistProfileDto(user, psychologist, specializationNames, kyc);
    }
}
