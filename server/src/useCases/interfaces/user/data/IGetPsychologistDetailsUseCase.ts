import { IPsychologistProfileDto } from '@/useCases/dtos/psychologist';

export interface IGetPsychologistDetailsUseCase {
    execute(userId: string): Promise<IPsychologistProfileDto>; 
}