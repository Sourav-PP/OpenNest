import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ITopUserDto } from '@/useCases/dtos/user';
import { IGetTopUsersUseCase } from '@/useCases/interfaces/psychologist/data/IGetTopUsersUseCase';

export class GetTopUsersUseCase implements IGetTopUsersUseCase {
    private _psychologistRepo: IPsychologistRepository;
    private _consultationRepo: IConsultationRepository;

    constructor(psychologistRepo: IPsychologistRepository, consultationRepo: IConsultationRepository) {
        this._psychologistRepo = psychologistRepo;
        this._consultationRepo = consultationRepo;
    }

    async execute(userId: string, limit: number): Promise<ITopUserDto[]> {
        const psychologist = await this._psychologistRepo.findByUserId(userId);
        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        return await this._consultationRepo.getTopUsersForPsychologist(psychologist.id, limit);
    }
}
