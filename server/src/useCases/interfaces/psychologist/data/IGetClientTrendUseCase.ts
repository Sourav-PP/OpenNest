import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IUniqueClientTrend } from '@/useCases/dtos/user';

export interface IGetClientTrendUseCase {
    execute(userId: string, filter: RevenueFilter): Promise<IUniqueClientTrend[]>;
}
