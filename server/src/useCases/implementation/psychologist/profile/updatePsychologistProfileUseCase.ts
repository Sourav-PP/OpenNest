import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';
import { AppError } from '@/domain/errors/AppError';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IUpdatePsychologistProfileUseCase } from '@/useCases/interfaces/psychologist/profile/IUpdatePsychologistProfileUseCase';
import { IUpdatePsychologistProfileInput } from '@/useCases/types/psychologistTypes';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { userMessages } from '@/shared/constants/messages/userMessages';

export class UpdatePsychologistProfileUseCase implements IUpdatePsychologistProfileUseCase {
    private _psychologistRepo: IPsychologistRepository;
    private _userRepo: IUserRepository;

    constructor(
        psychologistRepo: IPsychologistRepository,
        userRepo: IUserRepository,
    ) {
        this._psychologistRepo = psychologistRepo;
        this._userRepo = userRepo;
    }

    async execute(input: IUpdatePsychologistProfileInput): Promise<void> {
        const user = await this._userRepo.findById(input.userId);
        if (!user) throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        let profileImageUrl: string | undefined;

        if (input.file) {
            profileImageUrl = await uploadToCloudinary(
                input.file.buffer,
                input.file.originalname,
                'profile_images',
            );
        }

        const userUpdates: Partial<User> = {};

        if (input.name?.trim()) userUpdates.name = input.name?.trim();
        if (input.email?.trim()) userUpdates.email = input.email?.trim();
        if (input.phone?.trim()) userUpdates.phone = input.phone.trim();
        if (input.gender?.trim()) userUpdates.gender = input.gender.trim();
        if (input.dateOfBirth)
            userUpdates.dateOfBirth = new Date(input.dateOfBirth);
        if (profileImageUrl) userUpdates.profileImage = profileImageUrl;

        const psychologistUpdates: Partial<Psychologist> = {};

        if (input.aboutMe?.trim()) psychologistUpdates.aboutMe = input.aboutMe.trim();
        if (input.defaultFee !== undefined) psychologistUpdates.defaultFee = Number(input.defaultFee);

        await this._userRepo.updateProfile(input.userId, userUpdates);
        await this._psychologistRepo.updateByUserId(
            input.userId,
            psychologistUpdates,
        );
    }
}
