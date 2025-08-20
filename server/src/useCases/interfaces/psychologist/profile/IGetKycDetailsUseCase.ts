import { Kyc } from '@/domain/entities/kyc';

export interface IGetKycDetailsUseCase {
    execute(userId: string): Promise<Kyc>
}