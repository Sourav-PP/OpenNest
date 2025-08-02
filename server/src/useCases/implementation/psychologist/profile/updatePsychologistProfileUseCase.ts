import { Psychologist } from "../../../../domain/entities/psychologist";
import { User } from "../../../../domain/entities/user";
import { AppError } from "../../../../domain/errors/AppError";
import { IPsychologistRepository } from "../../../../domain/interfaces/IPsychologistRepository";
import { IUserRepository } from "../../../../domain/interfaces/IUserRepository";
import { IUpdatePsychologistProfileUseCase } from "../../../interfaces/psychologist/profile/IUpdatePsychologistProfileUseCase";
import { IUpdatePsychologistProfileInput } from "../../../types/psychologistTypes";

export class UpdatePsychologistProfileUseCase implements IUpdatePsychologistProfileUseCase {
    constructor(
        private psychologistRepo: IPsychologistRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(input: IUpdatePsychologistProfileInput): Promise<void> {
        const user = await this.userRepo.findById(input.userId)
        if(!user) throw new AppError("user not found", 404)

        const userUpdates: Partial<User> = {}

        if(input.name?.trim()) userUpdates.name = input.name?.trim()
        if(input.email?.trim()) userUpdates.email = input.email?.trim()
        if (input.phone?.trim()) userUpdates.phone = input.phone.trim();
        if (input.gender?.trim()) userUpdates.gender = input.gender.trim();
        if (input.dateOfBirth) userUpdates.dateOfBirth = new Date(input.dateOfBirth);
        if (input.profileImage) userUpdates.profileImage = input.profileImage;

        const psychologistUpdates: Partial<Psychologist> = {}

        if(input.aboutMe?.trim()) psychologistUpdates.aboutMe = input.aboutMe?.trim()
        if(input.defaultFee !== undefined) psychologistUpdates.defaultFee = Number(input.defaultFee)

        await this.userRepo.updateProfile(input.userId, userUpdates)
        await this.psychologistRepo.updateByUserId(input.userId, psychologistUpdates)
    }
}