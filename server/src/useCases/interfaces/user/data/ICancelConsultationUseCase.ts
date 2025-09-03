import { Consultation } from '@/domain/entities/consultation';

export interface ICancelConsultationUseCase {
    execute(
        userId: string,
        consultationId: string,
        reason: string,
    ): Promise<Consultation>;
}
