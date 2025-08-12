import { IGetKycDetailsUseCase } from "../../../interfaces/psychologist/profile/IGetKycDetailsUseCase";
import { IKycRepository } from "../../../../domain/interfaces/IKycRepository";
import { Kyc } from "../../../../domain/entities/kyc";
import { AppError } from "../../../../domain/errors/AppError";

export class GetKycDetailsUseCase implements IGetKycDetailsUseCase {
    constructor(
        private kycRepo: IKycRepository
    ) {}

    async execute(psychologistId: string): Promise<Kyc> {
        const kyc = await this.kycRepo.findByPsychologistId(psychologistId)

        if(!kyc) {
            throw new AppError("No Kyc found, Please verify your account", 404)
        }

        return kyc
    }
}