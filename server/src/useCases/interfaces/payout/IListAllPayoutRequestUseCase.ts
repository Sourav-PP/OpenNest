import { IGetAllPendingPayoutRequest, IGetAllPendingPayoutResponse } from '@/useCases/types/adminTypes';

export interface IListAllPayoutRequestsUseCase {
    execute(input: IGetAllPendingPayoutRequest): Promise<IGetAllPendingPayoutResponse>;
}
