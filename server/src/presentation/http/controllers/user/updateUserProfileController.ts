import { Request, Response } from "express";
import { UpdateUserProfileUseCase } from "../../../../useCases/user/updateProfile/updateUserProfileUseCase";
import { uploadToCloudinary } from "../../../../utils/uploadToCloudinary";

export class UpdateUserProfileController {
    constructor(private updateUserProfileUseCase: UpdateUserProfileUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            console.log("the request: ", req.body)
            console.log("is here right?")
            console.log("the file is : ",req.file)
            const userId = req.user?.userId!
            const {name, email, phone, gender, dateOfBirth} = req.body
            let profileImageUrl

            if(req.file) {
                profileImageUrl = await uploadToCloudinary(
                    req.file.buffer,
                    req.file.originalname,
                    "user_profiles"
                )
            }

            console.log("userId", userId)

            const updatedUser = await this.updateUserProfileUseCase.execute(userId, {
                name,
                email,
                phone,
                dateOfBirth,
                gender,
                profileImage: profileImageUrl
            })
            console.log("updated user: ",updatedUser)

            res.status(200).json({message: "profile updated successfully", user: updatedUser})
        } catch (error) {
            console.log("verify error: ", error)
            res.status(500).json({message: "Internal server error"})
            return
        }
    }
}