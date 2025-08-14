import { IKycDto } from '../../../../domain/dtos/kyc';

export interface IGetKycForPsychologistUseCase {
    execute(psychologistId: string): Promise<IKycDto>
}