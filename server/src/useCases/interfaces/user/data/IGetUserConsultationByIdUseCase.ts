import { IUserConsultationDetailsDto } from '@/useCases/dtos/consultation';

export interface IGetUserConsultationByIdUseCase {
    execute(consultationId: string): Promise<IUserConsultationDetailsDto>;
}
