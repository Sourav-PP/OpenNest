import { TopPsychologistDTO } from '@/useCases/dtos/psychologist';

export interface IGetTopPsychologistUseCase {
    execute(limit: number): Promise<TopPsychologistDTO[]>;
}
