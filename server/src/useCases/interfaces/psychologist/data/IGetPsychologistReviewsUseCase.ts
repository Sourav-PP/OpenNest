import { PaginatedPsychologistReviewsDTO } from '@/useCases/dtos/psychologist';

export interface IGetPsychologistReviewsUseCase {
    execute(psychologistId: string, page: number, limit: number): Promise<PaginatedPsychologistReviewsDTO>;
}
