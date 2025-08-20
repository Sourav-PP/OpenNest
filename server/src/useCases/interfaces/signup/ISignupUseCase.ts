import { ISignupInput, ISignupOutput } from '@/useCases/types/signupTypes';

export interface ISignupUseCase {
    execute(input: ISignupInput): Promise<ISignupOutput>
}