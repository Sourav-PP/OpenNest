export interface IToggleUserStatusUseCase {
  execute(userId: string, status: 'active' | 'inactive'): Promise<void>;
}