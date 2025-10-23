import { TopPsychologistSortFilter } from '@/domain/enums/SortFilterEnum';
import { TopPsychologistDTO } from '@/useCases/dtos/psychologist';

export interface IGetTopPsychologistUseCase {
    execute(limit: number, sortBy: TopPsychologistSortFilter): Promise<TopPsychologistDTO[]>;
}
