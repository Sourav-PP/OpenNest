export interface IMarkNotificationAsReadUseCase {
    execute(recipientId: string): Promise<void>;
}
