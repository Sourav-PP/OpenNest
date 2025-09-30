import { IConsultationHistoryDetailsDto } from '@/useCases/dtos/consultation';

export interface IGetUserConsultationHistoryDetailsUseCase {
    execute(consultationId: string): Promise<IConsultationHistoryDetailsDto>;
}
