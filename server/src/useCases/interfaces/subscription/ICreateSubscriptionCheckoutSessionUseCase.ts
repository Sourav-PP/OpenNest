export interface ICreateSubscriptionCheckoutSessionUseCase {
  execute(userId: string, planId: string, psychologistId: string): Promise<string>;
}