import { ISignupInput, ISignupOutput } from '../../types/signupTypes';

export interface ISignupUseCase {
    execute(input: ISignupInput): Promise<ISignupOutput>
}