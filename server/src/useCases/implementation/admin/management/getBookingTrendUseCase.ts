import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IAdminRepository } from '@/domain/repositoryInterface/IAdminRepository';
import { IBookingTrend } from '@/useCases/dtos/user';
import { IGetBookingTrendUseCase } from '@/useCases/interfaces/admin/management/IGetBookingTrendUseCase';

export class GetBookingTrendUseCase implements IGetBookingTrendUseCase {
    private _adminRepo: IAdminRepository;

    constructor(adminRepo: IAdminRepository) {
        this._adminRepo = adminRepo;
    }

    async execute(filter: RevenueFilter): Promise<IBookingTrend[]> {
        return await this._adminRepo.getBookingTrend(filter);
    }
}
