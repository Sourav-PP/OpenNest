import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { IPayoutRequestRepository } from '@/domain/repositoryInterface/IPayoutRequestRepository';
import { IListPayoutRequestsByPsychologistUseCase } from '@/useCases/interfaces/payout/IListPayoutRequestsByPsychologistUseCase';
import { IListPayoutRequestResponse } from '@/useCases/types/psychologistTypes';

export class ListPayoutRequestsByPsychologistUseCase implements IListPayoutRequestsByPsychologistUseCase {
    private _payoutRequestRepository: IPayoutRequestRepository;

    constructor(payoutRequestRepository: IPayoutRequestRepository) {
        this._payoutRequestRepository = payoutRequestRepository;
    }

    async execute(
        psychologistId: string,
        params: {
            sort?: SortFilter;
            page: number;
            limit: number;
        },
    ): Promise<IListPayoutRequestResponse> {
        const { sort, page = 1, limit = 10 } = params;
        const finalSort = sort === SortFilter.ASC || sort === SortFilter.DESC ? sort : SortFilter.DESC;
        const skip = (page - 1) * limit;

        const requests = await this._payoutRequestRepository.findByPsychologistId(psychologistId, {
            sort: finalSort,
            limit,
            skip,
        });

        const totalCount = await this._payoutRequestRepository.getTotalCountByPsychologistId(psychologistId);

        return {
            requests,
            totalCount,
        };
    }
}
