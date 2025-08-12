import { IApproveKycUseCase } from "../../../interfaces/admin/management/IApproveKycUseCase";
import { IKycRepository } from "../../../../domain/interfaces/IKycRepository";
import { AppError } from "../../../../domain/errors/AppError";

export class ApproveKycUseCase implements IApproveKycUseCase {
    constructor(
        private kycRepo: IKycRepository
    ) {}

    async execute(psychologistId: string): Promise<void> {
        if(!psychologistId) {
            throw new AppError("Missing psychologist Id", 400)
        }

        await this.kycRepo.approveKyc(psychologistId)
    }
}