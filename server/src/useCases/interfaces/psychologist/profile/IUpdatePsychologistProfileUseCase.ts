import { IUpdatePsychologistProfileInput } from '@/useCases/types/psychologistTypes';
import { IUpdateUserProfileOutput } from '@/useCases/types/userTypes';

export interface IUpdatePsychologistProfileUseCase {
    execute(input: IUpdatePsychologistProfileInput): Promise<IUpdateUserProfileOutput>
}