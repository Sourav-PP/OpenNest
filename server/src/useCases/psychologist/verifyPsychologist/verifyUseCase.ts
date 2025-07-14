import { PsychologistRepository } from "../../../domain/interfaces/psychologistRepository";
import { KycRepository } from "../../../domain/interfaces/kycRepository";
import { VerifyProfileRequest, VerifyProfileResponse } from "./verifyTypes";
import { IPsychologist } from "../../../domain/entities/psychologist";
import { AppError } from "../../../domain/errors/AppError";
import { IKyc } from "../../../domain/entities/kyc";

export class VerifyPsychologistUseCase {
    constructor(
        private psychologistRepository: PsychologistRepository,
        private kycRepository: KycRepository
    ) {}

    async execute(req: VerifyProfileRequest): Promise<VerifyProfileResponse> {
        const {
            userId,
            identificationDoc,
            educationalCertification,
            experienceCertificate,
            ...profileData
        } = req

        const existingPsychologist = await this.psychologistRepository.findById(userId)
        let psychologist: IPsychologist | null

        if(existingPsychologist) {
            psychologist = await this.psychologistRepository.updateByUserId(userId, {
                ...profileData,
                isVerified: false
            })

            await this.kycRepository.updateByPsychologistId(existingPsychologist._id,{
                identificationDoc,
                educationalCertification,
                experienceCertificate,
                kycStatus: "pending"
            })
        }else{

            psychologist = await this.psychologistRepository.create({userId, ...profileData, isVerified: false})
    
            await this.kycRepository.create({
                psychologistId: psychologist._id!,
                identificationDoc,
                educationalCertification,
                experienceCertificate,
                kycStatus: "pending"
            })
        }

        if(!psychologist) {
            throw new AppError("Psychologist creation or updation failed")
        }

        console.log("psycholgist: ", psychologist)

        const kyc = await this.kycRepository.findByPsychologistId(psychologist._id!);

        if (!kyc) {
            console.log("kyc is not here")
            throw new AppError("KYC not found after creation");
        }

        return {
            psychologist,
            kyc
        }
    }
}