import { IUpdatePsychologistProfileInput } from '@/useCases/types/psychologistTypes';

export interface IUpdatePsychologistProfileUseCase {
    execute(input: IUpdatePsychologistProfileInput): Promise<void>
}