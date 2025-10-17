import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { AppError } from '@/domain/errors/AppError';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IGetPsychologistDetailsUseCase } from '@/useCases/interfaces/user/data/IGetPsychologistDetailsUseCase';
import { IPsychologistProfileDto } from '@/useCases/dtos/psychologist';
import { toPsychologistProfileDto } from '@/useCases/mappers/psychologistMapper';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetPsychologistDetailsUseCase implements IGetPsychologistDetailsUseCase {
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

        if (!user) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        const psychologist = await this._psychologistRepo.findByUserId(userId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const specializationNames = await this._psychologistRepo.getSpecializationNamesByIds(
            psychologist.specializations,
        );

        if (!specializationNames || specializationNames.length === 0) {
            throw new AppError(psychologistMessages.ERROR.NO_SPECIALIZATIONS, HttpStatus.NOT_FOUND);
        }

        const kyc = await this._kycRepo.findByPsychologistId(psychologist.id);

        return toPsychologistProfileDto(user, psychologist, specializationNames, kyc);
    }
}
