import { IGetKycForPsychologistUseCase } from "../../../interfaces/admin/management/IGetKycForPsychologistUseCase";
import { IKycRepository } from "../../../../domain/interfaces/IKycRepository";
import { IKycDto } from "../../../../domain/dtos/kyc";
import { AppError } from "../../../../domain/errors/AppError";

export class GetKycForPsychologistUseCase implements IGetKycForPsychologistUseCase {
    constructor (
        private kycRepo: IKycRepository
    ) {}

    async execute(psychologistId: string): Promise<IKycDto> {
        if(!psychologistId) {
            throw new AppError('psychologistId not found', 404)
        }

        const kyc = await this.kycRepo.findByPsychologistIdForAdmin(psychologistId)

        if(!kyc) {
            throw new AppError("No kyc found for the psychologist", 404)
        }

        return kyc
    }
}