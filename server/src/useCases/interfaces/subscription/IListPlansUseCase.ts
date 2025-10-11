import { Plan } from '@/domain/entities/plan';

export interface IListPlansUseCase {
    execute(): Promise<Plan[]>;
}
