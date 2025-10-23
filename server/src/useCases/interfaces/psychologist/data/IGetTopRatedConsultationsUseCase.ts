import { ITopConsultationDto } from '@/useCases/dtos/consultation';

export interface IGetTopRatedConsultationsUseCase {
    execute(userId: string, limit: number): Promise<ITopConsultationDto[]>;
}
