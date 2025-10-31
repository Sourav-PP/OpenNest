export interface IGetUnreadCountUseCase {
  execute(roomId: string, userId: string): Promise<number>;
}