import { IUserRepository } from '../../../../domain/interfaces/IUserRepository';
import { IGetAllUserUseCase } from '../../../interfaces/admin/management/IGetAllUsersUseCase';
import { IGetAllUserRequest, IGetAllUserResponse } from '../../../types/adminTypes';

export class GetAllUserUseCase implements IGetAllUserUseCase {
    constructor(private userRepo: IUserRepository ) {}

    async execute(input: IGetAllUserRequest): Promise<IGetAllUserResponse> {
        const { search, sort, gender, page = 1, limit = 10 } = input;

        const finalSort = (sort === 'asc' || sort === 'desc') ? sort : 'desc';
        const skip = (page - 1) * limit;

        const users = await this.userRepo.findAll({
            search,
            sort: finalSort,
            limit,
            skip,
            gender,
        });

        console.log('users in useCase: ', users);
        const mappedUser = users.map(user => ({
            id: user.id!,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profileImage: user.profileImage,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            isActive: user.isActive,
        }));
        console.log('mapped user in useCase: ', mappedUser);

        const totalCount = await this.userRepo.countAll({ search, gender });

        return {
            user: mappedUser,
            totalCount,
        };
    }
}