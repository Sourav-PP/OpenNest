import { Consultation } from '@/domain/entities/consultation';

export interface IUpdateConsultationNotesUseCase {
    execute(input: { consultationId: string; userId: string; privateNotes?: string; feedback?: string }): Promise<Consultation>;
}
