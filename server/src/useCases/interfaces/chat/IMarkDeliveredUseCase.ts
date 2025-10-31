export interface IMarkDeliveredUseCase {
    execute(roomId: string, messageIds: string[], userId: string): Promise<void>
}