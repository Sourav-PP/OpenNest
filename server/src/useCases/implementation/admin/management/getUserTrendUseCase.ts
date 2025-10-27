import { RevenueFilter } from '@/domain/enums/SortFilterEnum';
import { IAdminRepository } from '@/domain/repositoryInterface/IAdminRepository';
import { IUserTrendDto } from '@/useCases/dtos/user';
import { IGetUserTrendUseCase } from '@/useCases/interfaces/admin/management/IGetUserTrendUseCase';

export class GetUserTrendUseCase implements IGetUserTrendUseCase {
    private _adminRepo: IAdminRepository;

    constructor(adminRepo: IAdminRepository) {
        this._adminRepo = adminRepo;
    }

    async execute(filter: RevenueFilter): Promise<IUserTrendDto[]> {
        return await this._adminRepo.getUserTrend(filter);
    }
}
