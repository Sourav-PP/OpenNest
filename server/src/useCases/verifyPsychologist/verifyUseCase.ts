import { PsychologistRepository } from "../../domain/interfaces/psychologistRepository";
import { KycRepository } from "../../domain/interfaces/kycRepository";
import { VerifyProfileRequest, VerifyProfileResponse } from "./verifyTypes";

export class VerifyPsychologistUseCase {
    constructor(
        private psychologistRepository: PsychologistRepository,
        private kycRepository: KycRepository
    ) {}

    async execute(req: VerifyProfileRequest): Promise<VerifyProfileResponse> {
        const {
            identificationDoc,
            educationalCertification,
            experienceCertificate,
            ...profileData
        } = req

        const psychologist = await this.psychologistRepository.create({...profileData, isVerified: false})

        const kyc = await this.kycRepository.create({
            psychologistId: psychologist._id!,
            identificationDoc,
            educationalCertification,
            experienceCertificate,
            kycStatus: "pending"
        })

        return {
            psychologist,
            kyc
        }
    }
}