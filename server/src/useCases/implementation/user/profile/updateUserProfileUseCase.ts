import { User } from '../../../../domain/entities/user';
import { IUserRepository } from '../../../../domain/interfaces/IUserRepository';
import { IUpdateUserProfileInput, IUpdateUserProfileOutput } from '../../../types/userTypes';
import { IUpdateUserProfileUseCase } from '../../../interfaces/user/profile/IUpdateUserProfileUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(input: IUpdateUserProfileInput): Promise<IUpdateUserProfileOutput> {
        const user = await this.userRepo.findById(input.userId);
        if (!user) throw new AppError('user not found', 404);

        const updates: Partial<User> = {};

        if (input.name?.trim()) updates.name = input.name?.trim();
        if (input.email?.trim()) updates.email = input.email?.trim();
        if (input.phone?.trim()) updates.phone = input.phone.trim();
        if (input.gender?.trim()) updates.gender = input.gender.trim();
        if (input.dateOfBirth) updates.dateOfBirth = new Date(input.dateOfBirth);
        if (input.profileImage) updates.profileImage = input.profileImage;

        console.log('updates :', updates);

        const updateUser = await this.userRepo.updateProfile(input.userId, updates);

        if (!updateUser) throw new AppError('updating profile failed', 500);

        return {
            id: input.userId,
            name: updateUser.name,
            email: updateUser.email,
        };
    }
}