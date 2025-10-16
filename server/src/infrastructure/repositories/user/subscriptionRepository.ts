import { ISubscriptionRepository } from '@/domain/repositoryInterface/ISubscriptionRepository';
import { GenericRepository } from '../GenericRepository';
import { Subscription } from '@/domain/entities/subscription';
import {
    ISubscriptionDocument,
    SubscriptionModel,
} from '@/infrastructure/database/models/user/SubscriptionModel';
import mongoose, { PipelineStage, Types } from 'mongoose';
import { Plan } from '@/domain/entities/plan';
import { SubscriptionStatus } from '@/domain/enums/PlanEnums';

export class SubscriptionRepository
    extends GenericRepository<Subscription, ISubscriptionDocument>
    implements ISubscriptionRepository
{
    constructor() {
        super(SubscriptionModel);
    }

    async findByStripeSubscriptionId(
        stripeSubscriptionId: string,
    ): Promise<Subscription | null> {
        const subscription = await SubscriptionModel.findOne({
            stripeSubscriptionId,
        }).exec();
        if (!subscription) return null;
        return this.map(subscription);
    }

    async findByUserId(userId: string): Promise<Subscription[]> {
        const subscriptions = await SubscriptionModel.find({ userId }).exec();
        return subscriptions.map(s => this.map(s));
    }

    async findActiveByUserId(userId: string): Promise<{subscription: Subscription; plan: Plan} | null> {
        const pipeline: PipelineStage[] = [
            { $match: { userId: new mongoose.Types.ObjectId(userId), status: SubscriptionStatus.ACTIVE, creditRemaining: { $gt: 0 } } },

            {
                $lookup: {
                    from: 'plans', 
                    localField: 'planId',
                    foreignField: '_id',
                    as: 'plan',
                },
            },
            { $unwind: '$plan' },
        ];

        const result = await SubscriptionModel.aggregate(pipeline).exec();

        if (!result || result.length === 0) return null;

        const item = result[0];

        return {
            subscription: {
                id: item._id.toString(),
                userId: item.userId.toString(),
                planId: item.planId.toString(),
                stripeSubscriptionId: item.stripeSubscriptionId,
                stripeCustomerId: item.stripeCustomerId,
                amount: item.amount,
                currency: item.currency,
                creditRemaining: item.creditRemaining,
                creditsPerPeriod: item.creditsPerPeriod,
                status: item.status,
                currentPeriodStart: item.currentPeriodStart,
                currentPeriodEnd: item.currentPeriodEnd,
            } as Subscription,
            plan: {
                id: item.plan._id.toString(),
                name: item.plan.name,
                description: item.plan.description,
                price: item.plan.price,
                billingPeriod: item.plan.billingPeriod,
                creditsPerPeriod: item.plan.creditsPerPeriod,
            } as Plan,
        };
    }

    async cancelByUserId(userId: string): Promise<Subscription | null> {
        const subscription = await SubscriptionModel.findOneAndUpdate(
            { userId, status: SubscriptionStatus.ACTIVE },
            { status: SubscriptionStatus.CANCELED },
            { new: true },
        ).exec();
        if (!subscription) return null;
        return this.map(subscription);
    }   

    async decrementCreditsAtomically(
        subscriptionId: string,
        amount: number,
    ): Promise<Subscription | null> {
        const subscription = await SubscriptionModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(subscriptionId),
                creditRemaining: { $gte: amount },
            },
            { $inc: { creditRemaining: -amount } },
            { new: true },
        ).exec();

        if (!subscription) return null;
        return this.map(subscription);
    }

    async resetCredits(
        subscriptionId: string,
        credits: number,
    ): Promise<Subscription | null> {
        const updated = await SubscriptionModel.findByIdAndUpdate(
            subscriptionId,
            { $set: { creditRemaining: credits } },
            { new: true },
        ).exec();
        if (!updated) return null;
        return this.map(updated);
    }
}
