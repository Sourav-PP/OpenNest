export interface IMarkDeliveredUseCase {
    execute(consultationId: string, messageIds: string[], userId: string): Promise<void>
}