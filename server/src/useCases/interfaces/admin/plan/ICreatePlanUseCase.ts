import { Plan } from '@/domain/entities/plan';

export interface ICreatePlanUseCase {
    execute(data: {
        name: string;
        description?: string;
        price: number;
        currency: string;
        creditsPerPeriod: number;
        billingPeriod: 'month' | 'year' | 'week';
    }): Promise<Plan>;
}
