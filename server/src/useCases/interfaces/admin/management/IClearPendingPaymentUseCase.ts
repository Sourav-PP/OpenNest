export interface IClearPendingPaymentUseCase {
    execute(): Promise<void>;
}