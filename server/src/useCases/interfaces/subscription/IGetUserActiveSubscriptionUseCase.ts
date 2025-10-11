import { ISubscriptionDto } from '@/useCases/dtos/subscription';

export interface IGetUserActiveSubscriptionUseCase {
    execute(userId: string): Promise<ISubscriptionDto | null>;
}
