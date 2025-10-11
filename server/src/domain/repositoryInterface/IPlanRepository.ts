import { Plan } from '../entities/plan';

export interface IPlanRepository {
    findAll(): Promise<Plan[]>;
    create(plan: Omit<Plan, 'id'>): Promise<Plan>;
    findById(id: string): Promise<Plan | null>;
    findByStripePriceId(priceId: string): Promise<Plan | null>;
    list(): Promise<Plan[]>;
}
