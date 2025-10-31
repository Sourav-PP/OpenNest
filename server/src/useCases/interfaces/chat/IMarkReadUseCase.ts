export interface IMarkReadUseCase {
    execute(roomId: string, userId: string): Promise<void>;
}