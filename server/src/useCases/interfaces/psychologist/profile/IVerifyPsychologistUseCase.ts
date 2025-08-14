import { IVerifyProfileInput, IVerifyProfileOutput } from '../../../types/psychologistTypes';

export interface IVerfiyPsychologistUseCase {
    execute(input: IVerifyProfileInput): Promise<IVerifyProfileOutput>
}