import { IGetAllKycRequest, IGetAllKycResponse } from '@/useCases/types/adminTypes';

export interface IGetAllKycUseCase {
    execute(input: IGetAllKycRequest): Promise<IGetAllKycResponse>
}