import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { IListPayoutRequestResponse } from '@/useCases/types/psychologistTypes';

export interface IListPayoutRequestsByPsychologistUseCase {
    execute(
        psychologistId: string,
        params: {
            sort?: SortFilter;
            page: number;
            limit: number;
        },
    ): Promise<IListPayoutRequestResponse>;
}
