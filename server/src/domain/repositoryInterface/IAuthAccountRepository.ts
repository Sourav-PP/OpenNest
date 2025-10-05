export interface IAuthAccountRepository {
  findById(id: string): Promise<{ id: string; role: string; email: string; isActive?: boolean } | null>;
}