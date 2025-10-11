import { Subscription } from '@/domain/entities/subscription';
import { ISubscriptionDto } from '../dtos/subscription';
import { Plan } from '@/domain/entities/plan';

export function toSubscriptionDto(
    subscription: Subscription,
    plan: Plan,
): ISubscriptionDto {
    return {
        id: subscription.id,
        userId: subscription.userId,
        amount: subscription.amount,
        currency: subscription.currency,
        creditRemaining: subscription.creditRemaining,
        creditsPerPeriod: subscription.creditsPerPeriod,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        canceledAt: subscription.canceledAt,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
        plan: {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            billingPeriod: plan.billingPeriod,
            creditsPerPeriod: plan.creditsPerPeriod,
        },
    };
}
