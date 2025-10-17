import { ISubscriptionRepository } from '@/domain/repositoryInterface/ISubscriptionRepository';
import { ISubscriptionDto } from '@/useCases/dtos/subscription';
import { IGetUserActiveSubscriptionUseCase } from '@/useCases/interfaces/subscription/IGetUserActiveSubscriptionUseCase';
import { toSubscriptionDto } from '@/useCases/mappers/subscriptionMapper';

export class GetUserActiveSubscriptionUseCase implements IGetUserActiveSubscriptionUseCase {
    private _subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }

    async execute(userId: string): Promise<ISubscriptionDto | null> {
        const result = await this._subscriptionRepository.findActiveByUserId(userId);

        if (!result) {
            return null;
        }
        return toSubscriptionDto(result.subscription, result.plan);
    }
}
