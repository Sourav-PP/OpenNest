import { ISubscriptionDto } from '@/useCases/dtos/subscription';

export interface ICancelSubscriptionUseCase {
    execute(userId: string): Promise<ISubscriptionDto | null>;
}
