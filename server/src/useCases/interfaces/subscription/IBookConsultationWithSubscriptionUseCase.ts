import { Consultation } from '@/domain/entities/consultation';
import { Subscription } from '@/domain/entities/subscription';

export interface IBookConsultationWithSubscriptionUseCase {
    execute(
        userId: string,
        subscriptionId: string,
        slotId: string,
        sessionGoal: string,
    ): Promise<{ consultation: Consultation; subscription: Subscription }>;
}
