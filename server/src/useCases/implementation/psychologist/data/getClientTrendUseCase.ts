import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IUniqueClientTrend } from '@/useCases/dtos/user';
import { IGetClientTrendUseCase } from '@/useCases/interfaces/psychologist/data/IGetClientTrendUseCase';

export class GetClientTrendUseCase implements IGetClientTrendUseCase {
    private _psychologistRepo: IPsychologistRepository;

    constructor(psychologistRepo: IPsychologistRepository) {
        this._psychologistRepo = psychologistRepo;
    }

    async execute(userId: string, filter: RevenueFilter): Promise<IUniqueClientTrend[]> {
        const psychologist = await this._psychologistRepo.findByUserId(userId);
        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        return await this._psychologistRepo.getUniqueClientTrend(psychologist.id, filter);
    }
}
