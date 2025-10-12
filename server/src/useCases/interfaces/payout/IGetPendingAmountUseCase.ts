export interface IGetPendingAmountUseCase {
    execute(
        psychologistId: string,
    ): Promise<{
        totalAmount: number;
        commissionAmount: number;
        payoutAmount: number;
        consultationCount: number;
        consultationIds: string[];
    }>;
}
