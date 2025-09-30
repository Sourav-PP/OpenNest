import {
    IGetUserConsultationHistoryRequest,
    IGetUserConsultationHistoryResponse,
} from '@/useCases/types/userTypes';

export interface IGetUserConsultationHistoryUseCase {
    execute(
        input: IGetUserConsultationHistoryRequest,
    ): Promise<IGetUserConsultationHistoryResponse>;
}
