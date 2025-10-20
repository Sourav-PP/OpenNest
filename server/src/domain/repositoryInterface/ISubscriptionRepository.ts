import { Plan } from '../entities/plan';
import { Subscription } from '../entities/subscription';

export interface ISubscriptionRepository {
    create(subscription: Omit<Subscription, 'id'>): Promise<Subscription>;
    findById(id: string): Promise<Subscription | null>;
    findByStripeSubscriptionId(
        stripeSubscriptionId: string,
    ): Promise<Subscription | null>;
    findByUserId(userId: string): Promise<Subscription[]>;
    findActiveByUserId(userId: string): Promise<{subscription: Subscription; plan: Plan} | null>;
    cancelByUserId(userId: string): Promise<Subscription | null>;
    updateById(
        subscriptionId: string,
        data: Partial<Subscription>,
    ): Promise<Subscription | null>;
    decrementCreditsAtomically(
        subscriptionId: string,
        amount: number,
    ): Promise<Subscription | null>;
    incrementCredit(
        subscriptionId: string,
        amount: number,
    ): Promise<Subscription | null>;
    resetCredits(
        subscriptionId: string,
        credits: number,
    ): Promise<Subscription | null>;
}
