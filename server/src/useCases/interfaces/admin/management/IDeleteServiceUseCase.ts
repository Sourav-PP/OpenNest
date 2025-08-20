export interface IDeleteServiceUseCase {
  execute(id: string): Promise<void>
}