export interface IMarkReadUseCase {
    execute(consultationId: string, messageIds: string[], userId: string): Promise<void>;
}