import { IPsychologistProfileDto } from '@/useCases/dtos/psychologist';

export interface IGetProfileUseCase {
    execute(userId: string): Promise<IPsychologistProfileDto>;
}