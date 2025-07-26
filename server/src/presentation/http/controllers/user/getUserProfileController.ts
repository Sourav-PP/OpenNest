import { Request, Response } from "express";
import { GetUserProfileUseCase } from "../../../../useCases/implementation/user/profile/getUserProfileUseCase";
import { AppError } from "../../../../domain/errors/AppError";

export class GetUserProfileController {
    constructor(private getUserProfile: GetUserProfileUseCase) {}

    handle = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.user?.userId
            if(!id) throw new Error("no userId in the request while geting user profile")
            const userProfile = await this.getUserProfile.execute({userId: id})

            res.status(200).json(userProfile)
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}