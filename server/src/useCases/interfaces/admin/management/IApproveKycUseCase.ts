export interface IApproveKycUseCase {
    execute(psychologistId: string): Promise<void>
}