import { Consultation } from '@/domain/entities/consultation';

export interface IEnsureMembershipUseCase {
    execute(userId: string, consultationId: string): Promise<Consultation>;
}
