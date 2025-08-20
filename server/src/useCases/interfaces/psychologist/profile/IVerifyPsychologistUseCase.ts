import { IVerifyProfileInput, IVerifyProfileOutput } from '@/useCases/types/psychologistTypes';

export interface IVerifyPsychologistUseCase {
    execute(input: IVerifyProfileInput): Promise<IVerifyProfileOutput>
}