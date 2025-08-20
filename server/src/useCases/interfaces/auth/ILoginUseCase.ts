import { ILoginInput, ILoginOutput } from '@/useCases/types/authTypes';

export interface ILoginUseCase {
    execute(input: ILoginInput): Promise<ILoginOutput>
}