import { PsychologistRepository } from "../../domain/interfaces/psychologistRepository";
import { KycRepository } from "../../domain/interfaces/kycRepository";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { AppError } from "../../domain/errors/AppError";

export class GetProfileUseCase {
    constructor(
        private psychologistRepo: PsychologistRepository,
        private kycRepo: KycRepository,
        private userRepo: UserRepository
    ) {}

    async execute(userId: string) {
        const user = await this.userRepo.findById(userId)

        if (!user) throw new AppError("User not found", 404);

        const psychologist = await this.psychologistRepo.findByUserId(userId)
        if(!psychologist) {
            throw new AppError("psychologist not found", 404)
        }
        const specializationNames = await this.psychologistRepo.getSpecializationNamesByIds(psychologist.specializations)

        console.log("psychologist", psychologist)

        const kyc = await this.kycRepo.findByPsychologistId(psychologist._id!)

        return {
            name: user?.name,
            email: user?.email,
            dob: user?.dateOfBirth,
            fees: psychologist.defaultFee,
            qualification: psychologist.qualification,
            aboutMe: psychologist.aboutMe,
            specializations: specializationNames,
            image: user?.profileImage,
            kycStatus: kyc?.kycStatus || "pending"
        }
    }
}