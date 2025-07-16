import { IUser } from "../../../domain/entities/user";
import { UserRepository } from "../../../domain/interfaces/userRepository";
import { AppError } from "../../../domain/errors/AppError";

export class UpdateUserProfileUseCase {
    constructor(private userRepo: UserRepository) {}

    async execute(id: string , data: Partial<IUser>): Promise<IUser> {
        const user = await this.userRepo.findById(id)
        if(!user) throw new AppError("user not found", 404)

        const updates: Partial<IUser> = {}

        if(data.name?.trim()) updates.name = data.name?.trim()
        if(data.email?.trim()) updates.email = data.email?.trim()
        if (data.phone?.trim()) updates.phone = data.phone.trim();
        if (data.gender?.trim()) updates.gender = data.gender.trim();
        if (data.dateOfBirth) updates.dateOfBirth = new Date(data.dateOfBirth);
        if (data.profileImage) updates.profileImage = data.profileImage;

        console.log("updates :", updates)

        const updateUser = await this.userRepo.updateProfile(id, updates)

        if(!updateUser) throw new AppError("updating profile failed", 500)

        return updateUser
    }
}