import { ILoginInput, ILoginOutput } from '../../types/authTypes';

export interface ILoginUseCase {
    execute(input: ILoginInput): Promise<ILoginOutput>
}