import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IPsychologistBookingTrend } from '@/useCases/dtos/user';
import { IGetPsychologistBookingTrendUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistBookingTrendUseCase';

export class GetPsychologistBookingTrendUseCase implements IGetPsychologistBookingTrendUseCase {
    private _psychologistRepo: IPsychologistRepository;

    constructor(psychologistRepo: IPsychologistRepository) {
        this._psychologistRepo = psychologistRepo;
    }

    async execute(userId: string, filter: RevenueFilter): Promise<IPsychologistBookingTrend[]> {
        const psychologist = await this._psychologistRepo.findByUserId(userId);
        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        return await this._psychologistRepo.getConsultationTrend(psychologist.id, filter);
    }
}
