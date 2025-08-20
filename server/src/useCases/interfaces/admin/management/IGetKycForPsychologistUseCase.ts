import { IKycDto } from '@/useCases/dtos/kyc';

export interface IGetKycForPsychologistUseCase {
    execute(psychologistId: string): Promise<IKycDto>
}