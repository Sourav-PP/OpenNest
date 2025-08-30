export interface IMarkReadUseCase {
    execute(consultationId: string, userId: string): Promise<void>;
}