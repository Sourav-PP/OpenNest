import { IListPayoutRequestResponse } from '@/useCases/types/psychologistTypes';

export interface IListPayoutRequestsByPsychologistUseCase {
    execute(
        psychologistId: string,
        params: {
            sort?: 'asc' | 'desc';
            page: number;
            limit: number;
        },
    ): Promise<IListPayoutRequestResponse>;
}
