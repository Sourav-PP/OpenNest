import { AppError } from '@/domain/errors/AppError';
import { ISubscriptionRepository } from '@/domain/repositoryInterface/ISubscriptionRepository';
import { IPaymentService } from '@/domain/serviceInterface/IPaymentService';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { ISubscriptionDto } from '@/useCases/dtos/subscription';
import { ICancelSubscriptionUseCase } from '@/useCases/interfaces/subscription/ICancelSubscriptionUseCase';
import { toSubscriptionDto } from '@/useCases/mappers/subscriptionMapper';

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

    async execute(userId: string): Promise<ISubscriptionDto | null> {
        const result =
            await this._subscriptionRepository.findActiveByUserId(userId);
        if (!result) {
            throw new AppError(
                SubscriptionMessages.ERROR.NO_ACTIVE_SUBSCRIPTION,
            );
        }
        await this._paymentService.cancelSubscription(
            result.subscription.stripeSubscriptionId,
        );

        await this._subscriptionRepository.cancelByUserId(userId);
        const mapped = toSubscriptionDto(result.subscription, result.plan);

        return mapped;
    }
}
