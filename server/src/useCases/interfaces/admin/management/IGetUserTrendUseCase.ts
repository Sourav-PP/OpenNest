import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IUserTrendDto } from '@/useCases/dtos/user';

export interface IGetUserTrendUseCase {
    execute(filter: RevenueFilter): Promise<IUserTrendDto[]>;
}
