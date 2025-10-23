import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IRevenueStatDto } from '@/useCases/dtos/consultation';
import { IGetPsychologistRevenueStatsUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistRevenueStatsUseCase';

export class GetPsychologistRevenueStatsUseCase implements IGetPsychologistRevenueStatsUseCase {
    private _consultationRepo: IConsultationRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(consultationRepo: IConsultationRepository, psychologistRepo: IPsychologistRepository) {
        this._consultationRepo = consultationRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(userId: string, filter: RevenueFilter): Promise<IRevenueStatDto[]> {
        const psychologist = await this._psychologistRepo.findByUserId(userId);
        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        return await this._consultationRepo.getPsychologistRevenueStats(psychologist.id, filter);
    }
}
