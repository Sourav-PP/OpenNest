export interface AuthAccountRepository {
  findById(id: string): Promise<{ _id: string; role: string; email: string } | null>;
}