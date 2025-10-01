import {
    IGetPatientConsultationHistoryRequest,
    IGetPatientConsultationHistoryResponse,
} from '@/useCases/types/psychologistTypes';

export interface IGetPatientConsultationHistoryUseCase {
    execute(
        input: IGetPatientConsultationHistoryRequest,
    ): Promise<IGetPatientConsultationHistoryResponse>;
}
