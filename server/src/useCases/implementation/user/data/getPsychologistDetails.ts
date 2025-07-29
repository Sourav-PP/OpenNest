import { IKycRepository } from "../../../../domain/interfaces/IKycRepository";
import { IUserRepository } from "../../../../domain/interfaces/IUserRepository";
import { AppError } from "../../../../domain/errors/AppError";
import { IPsychologistRepository } from "../../../../domain/interfaces/IPsychologistRepository";

export class GetPsychologistDetailsUseCase {
    constructor(
        private psychologistRepo: IPsychologistRepository,
        private kycRepo: IKycRepository,
        private userRepo: IUserRepository
    ) {}

    async execute(userId: string) {
        const user = await this.userRepo.findById(userId)

        if (!user) throw new AppError("User not found", 404);

        const psychologist = await this.psychologistRepo.findByUserId(userId)
        if(!psychologist) {
            throw new AppError("psychologist not found", 404)
        }
        const specializationNames = await this.psychologistRepo.getSpecializationNamesByIds(psychologist.specializations)

        const kyc = await this.kycRepo.findByPsychologistId(psychologist.id!)

        return {
            id: psychologist.id,
            name: user?.name,
            email: user?.email,
            dateOfBirth: user?.dateOfBirth,
            defaultFee: psychologist.defaultFee,
            qualification: psychologist.qualification,
            aboutMe: psychologist.aboutMe,
            specializations: specializationNames,
            profileImage: user?.profileImage,
            kycStatus: kyc?.kycStatus || "pending",
            specializationFees: psychologist.specializationFees
        }
    }

}