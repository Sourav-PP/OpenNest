import {
    IGetConsultationHistoryRequest,
    IGetConsultationHistoryResponse,
} from '@/useCases/types/psychologistTypes';

export interface IGetPsychologistConsultationHistoryUseCase {
    execute(
        input: IGetConsultationHistoryRequest,
    ): Promise<IGetConsultationHistoryResponse>;
}
