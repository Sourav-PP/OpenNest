import { IGetAllServiceInput, IGetAllServiceOutput } from '@/useCases/types/serviceTypes';

export interface IGetAllServiceUseCase {
    execute(input: IGetAllServiceInput): Promise<IGetAllServiceOutput>
}