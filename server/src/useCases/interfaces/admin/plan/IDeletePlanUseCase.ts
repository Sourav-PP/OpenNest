export interface IDeletePlanUseCase {
    execute(planId: string): Promise<void>;
}