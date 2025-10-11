import { Subscription } from '@/domain/entities/subscription';
import { AppError } from '@/domain/errors/AppError';
import { ISubscriptionRepository } from '@/domain/repositoryInterface/ISubscriptionRepository';
import { IPaymentService } from '@/domain/serviceInterface/IPaymentService';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { ICancelSubscriptionUseCase } from '@/useCases/interfaces/subscription/ICancelSubscriptionUseCase';

export class CancelSubscriptionUseCase implements ICancelSubscriptionUseCase {
    private _subscriptionRepository: ISubscriptionRepository;
    private _paymentService: IPaymentService;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        paymentService: IPaymentService,
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._paymentService = paymentService;
    }

    async execute(userId: string): Promise<Subscription | null> {
        const subscription =
            await this._subscriptionRepository.findActiveByUserId(userId);
        if (!subscription) {
            throw new AppError(
                SubscriptionMessages.ERROR.NO_ACTIVE_SUBSCRIPTION,
            );
        }
        await this._paymentService.cancelSubscription(
            subscription.stripeSubscriptionId,
        );

        await this._subscriptionRepository.cancelByUserId(userId);

        return subscription;
    }
}
