import { IUpdatePsychologistProfileInput } from '../../../types/psychologistTypes';

export interface IUpdatePsychologistProfileUseCase {
    execute(input: IUpdatePsychologistProfileInput): Promise<void>
}