import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IRevenueStatDto } from '@/useCases/dtos/consultation';

export interface IGetPsychologistRevenueStatsUseCase {
    execute(userId: string, filter: RevenueFilter): Promise<IRevenueStatDto[]>;
}
