import { Consultation } from '@/domain/entities/consultation';

export interface IPsychologistCancelConsultationUseCase {
    execute(
        psychologistId: string,
        consultationId: string,
        reason: string,
    ): Promise<Consultation>;
}
