import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { IPayoutRequestRepository } from '@/domain/repositoryInterface/IPayoutRequestRepository';
import { IListAllPayoutRequestsUseCase } from '@/useCases/interfaces/payout/IListAllPayoutRequestUseCase';
import { toPayoutRequestListDto } from '@/useCases/mappers/payoutMapper';
import {
    IGetAllPendingPayoutRequest,
    IGetAllPendingPayoutResponse,
} from '@/useCases/types/adminTypes';

export class ListAllPayoutRequestsUseCase implements IListAllPayoutRequestsUseCase {
    private _payoutRequestRepository: IPayoutRequestRepository;

    constructor(payoutRequestRepository: IPayoutRequestRepository) {
        this._payoutRequestRepository = payoutRequestRepository;
    }

    async execute(
        input: IGetAllPendingPayoutRequest,
    ): Promise<IGetAllPendingPayoutResponse> {
        const { search, sort, page = 1, limit = 10 } = input;
        const finalSort =
            sort === SortFilter.ASC || sort === SortFilter.DESC
                ? sort
                : SortFilter.DESC;
        const skip = (page - 1) * limit;

        const requests =
            await this._payoutRequestRepository.findAllWithPsychologist({
                search,
                sort: finalSort,
                limit,
                skip,
            });

        const mapped = requests.map(r =>
            toPayoutRequestListDto(r.payoutRequest, r.psychologist),
        );

        const totalCount = await this._payoutRequestRepository.countAll({
            search,
        });

        return {
            requests: mapped,
            totalCount,
        };
    }
}
