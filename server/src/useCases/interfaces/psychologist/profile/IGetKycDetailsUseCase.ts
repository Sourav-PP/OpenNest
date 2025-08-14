import { Kyc } from '../../../../domain/entities/kyc';

export interface IGetKycDetailsUseCase {
    execute(psychologistId: string): Promise<Kyc>
}