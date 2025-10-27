import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IPsychologistBookingTrend } from '@/useCases/dtos/user';

export interface IGetPsychologistBookingTrendUseCase {
    execute(userId: string, filter: RevenueFilter): Promise<IPsychologistBookingTrend[]>;
}
