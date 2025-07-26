import { IUserRepository } from "../../../../domain/interfaces/IUserRepository";
import { IGetUserProfileInput, IGetUserProfileOutput } from "../../../types/userTypes";
import { IGetUserProfileUseCase } from "../../../interfaces/user/profile/IGetUserProfileUseCase";
import { IUserDto } from "../../../../domain/dtos/user";
import { AppError } from "../../../../domain/errors/AppError";

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(input: IGetUserProfileInput): Promise<IGetUserProfileOutput> {
        const user = await this.userRepo.findById(input.userId)

        console.log('user: ', user)
        if(!user) throw new AppError("user not found", 404)

        const mappedUser = {
            id: user.id!,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profileImage: user.profileImage,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            isActive: user.isActive
        }

        return mappedUser
    }
}