export interface IRejectKycUseCase {
    execute(psychologistId: string, reason: string): Promise<void>
}