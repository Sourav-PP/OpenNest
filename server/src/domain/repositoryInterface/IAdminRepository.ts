import { IBookingTrend, IUserTrendDto } from '@/useCases/dtos/user';
import { Admin } from '../entities/admin';
import { RevenueFilter } from '../enums/SortFilterEnum';

export interface IAdminRepository {
    findByEmail(email: string): Promise<Admin | null>;
    getUserTrend(filter: RevenueFilter): Promise<IUserTrendDto[]>;
    getBookingTrend(filter: RevenueFilter): Promise<IBookingTrend[]>
}