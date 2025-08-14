import { IRejectKycUseCase } from '../../../interfaces/admin/management/IRejectKycUseCase';
import { IKycRepository } from '../../../../domain/interfaces/IKycRepository';
import { IPsychologistRepository } from '../../../../domain/interfaces/IPsychologistRepository';
import { AppError } from '../../../../domain/errors/AppError';

export class RejectKycUseCase implements IRejectKycUseCase {
    constructor(
        private kycRepo: IKycRepository,
        private psychologistRepo: IPsychologistRepository,
    ) {}

    async execute(psychologistId: string, reason: string): Promise<void> {
        if (!psychologistId) {
            throw new AppError('Missing psychologist Id', 400);
        }

        await this.kycRepo.rejectKyc(psychologistId, reason);

        await this.psychologistRepo.updateById(psychologistId, {
            isVerified: false,
        });
    }
}