import { User } from '@/domain/entities/user';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IUpdateUserProfileInput, IUpdateUserProfileOutput } from '@/useCases/types/userTypes';
import { IUpdateUserProfileUseCase } from '@/useCases/interfaces/user/profile/IUpdateUserProfileUseCase';
import { AppError } from '@/domain/errors/AppError';
import { toUserUpdatedDto } from '@/useCases/mappers/userMapper';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IFileStorage } from '@/useCases/interfaces/IFileStorage';
import { UserGender } from '@/domain/enums/UserEnums';

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    private _userRepo: IUserRepository;
    private _fileStorage: IFileStorage;

    constructor(userRepo: IUserRepository, fileStorage: IFileStorage) {
        this._userRepo = userRepo;
        this._fileStorage = fileStorage;
    }

    async execute(input: IUpdateUserProfileInput): Promise<IUpdateUserProfileOutput> {
        const user = await this._userRepo.findById(input.userId);
        if (!user) throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        let profileImageUrl: string | undefined;

        if (input.file) {
            profileImageUrl = await this._fileStorage.upload(
                input.file.buffer,
                input.file.originalname,
                'profile_images',
            );
        }

        const updates: Partial<User> = {};

        if (input.name?.trim()) updates.name = input.name?.trim();
        if (input.email?.trim()) updates.email = input.email?.trim();
        if (input.phone?.trim()) updates.phone = input.phone.trim();
        if (input.gender?.trim()) updates.gender = input.gender.trim() as UserGender;
        if (input.dateOfBirth) updates.dateOfBirth = new Date(input.dateOfBirth);
        if (profileImageUrl) updates.profileImage = profileImageUrl;

        const updateUser = await this._userRepo.updateProfile(input.userId, updates);

        if (!updateUser) throw new AppError(userMessages.ERROR.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);

        return toUserUpdatedDto(updateUser);
    }
}
