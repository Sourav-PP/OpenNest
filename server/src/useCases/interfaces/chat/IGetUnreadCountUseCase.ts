export interface IGetUnreadCountUseCase {
  execute(consultationId: string, userId: string): Promise<number>;
}