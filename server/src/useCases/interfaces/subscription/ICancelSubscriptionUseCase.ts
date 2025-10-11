import { Subscription } from '@/domain/entities/subscription';

export interface ICancelSubscriptionUseCase {
    execute(userId: string): Promise<Subscription | null>;
}
