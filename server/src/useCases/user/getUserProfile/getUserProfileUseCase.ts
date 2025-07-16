import { IUser } from "../../../domain/entities/user";
import { UserRepository } from "../../../domain/interfaces/userRepository";
import { AppError } from "../../../domain/errors/AppError";

export class GetUserProfileUseCase {
    constructor(private userRepo: UserRepository) {}

    async execute(id: string): Promise<IUser> {
        const user = await this.userRepo.findById(id)

        if(!user) throw new AppError("user not found", 404)

        return user
    }
}