import { Plan } from '@/domain/entities/plan';

export interface IGetAllPlanUseCase {
    execute(): Promise<Plan[]>;
}
