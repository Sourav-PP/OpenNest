import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IGetUserProfileInput } from '@/useCases/types/userTypes';
import { IGetUserProfileUseCase } from '@/useCases/interfaces/user/profile/IGetUserProfileUseCase';
import { AppError } from '@/domain/errors/AppError';
import { toUserDetailDto } from '@/useCases/mappers/userMapper';
import { IUserDto } from '@/useCases/dtos/user';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
    private _userRepo: IUserRepository;

    constructor(userRepo: IUserRepository) {
        this._userRepo = userRepo;
    }

    async execute(input: IGetUserProfileInput): Promise<IUserDto> {
        const user = await this._userRepo.findById(input.userId);

        if (!user) throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        return toUserDetailDto(user);
    }
}
