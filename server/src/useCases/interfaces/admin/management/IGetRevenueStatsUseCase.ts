import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IRevenueStatDto } from '@/useCases/dtos/consultation';

export interface IGetRevenueStatsUseCase {
    execute(filter: RevenueFilter): Promise<IRevenueStatDto[]>;
}
