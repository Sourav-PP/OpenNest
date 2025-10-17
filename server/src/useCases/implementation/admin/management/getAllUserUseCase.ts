import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IGetAllUserUseCase } from '@/useCases/interfaces/admin/management/IGetAllUsersUseCase';
import { IGetAllUserRequest, IGetAllUserResponse } from '../../../types/adminTypes';
import { toUserDetailDto } from '@/useCases/mappers/userMapper';
import { SortFilter } from '@/domain/enums/SortFilterEnum';

export class GetAllUserUseCase implements IGetAllUserUseCase {
    private _userRepo: IUserRepository;

    constructor(private userRepo: IUserRepository) {
        this._userRepo = userRepo;
    }

    async execute(input: IGetAllUserRequest): Promise<IGetAllUserResponse> {
        const { search, sort, gender, page = 1, limit = 10 } = input;

        const finalSort = sort === SortFilter.ASC || sort === SortFilter.DESC ? sort : SortFilter.DESC;
        const skip = (page - 1) * limit;

        const users = await this._userRepo.findAll({
            search,
            sort: finalSort,
            limit,
            skip,
            gender,
        });

        const mapped = users.map(user => toUserDetailDto(user));

        const totalCount = await this.userRepo.countAll({ search, gender });

        return {
            user: mapped,
            totalCount,
        };
    }
}
