import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IRevenueStatDto } from '@/useCases/dtos/consultation';
import { IGetRevenueStatsUseCase } from '@/useCases/interfaces/admin/management/IGetRevenueStatsUseCase';

export class GetRevenueStatsUseCase implements IGetRevenueStatsUseCase {
    private _consultationRepo: IConsultationRepository;

    constructor(consultationRepo: IConsultationRepository) {
        this._consultationRepo = consultationRepo;
    }

    async execute(filter: RevenueFilter): Promise<IRevenueStatDto[]> {
        return await this._consultationRepo.getRevenueStats(filter);
    }
}
