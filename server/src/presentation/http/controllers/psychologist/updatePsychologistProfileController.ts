import { Request, Response } from 'express';
import { UpdatePsychologistProfileUseCase } from '../../../../useCases/implementation/psychologist/profile/updatePsychologistProfileUseCase';
import { uploadToCloudinary } from '../../../../utils/uploadToCloudinary';
import { AppError } from '../../../../domain/errors/AppError';

export class UpdatePsychologistProfileController {
    constructor( private updatePsychologistUseCase: UpdatePsychologistProfileUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ success:false, message: 'Unauthorized user' });
                return;
            }

            const { name, email, phone, gender, dateOfBirth, aboutMe, defaultFee } = req.body;
            let profileImageUrl;

            if (req.file) {
                profileImageUrl = await uploadToCloudinary(
                    req.file.buffer,
                    req.file.originalname,
                    'profile_images',
                );
            }

            console.log('uesrId: ', userId);

            await this.updatePsychologistUseCase.execute({
                userId,
                name,
                email,
                phone,
                gender,
                dateOfBirth,
                defaultFee: defaultFee ? Number(defaultFee) : undefined,
                aboutMe,
                profileImage: profileImageUrl,
            });

            res.status(200).json({ message: 'profile updated successfully' });
            return;
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500;
            const message = error.message || 'Internal server error';
            res.status(status).json({ message });
        }
    };
}