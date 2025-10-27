import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IBookingTrend } from '@/useCases/dtos/user';

export interface IGetBookingTrendUseCase {
    execute(filter: RevenueFilter): Promise<IBookingTrend[]>;
}
