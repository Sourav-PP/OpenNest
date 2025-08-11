export interface ICreateCheckoutSessionInput {
    userId: string;
    psychologistId: string;
    subscriptionId?: string;
    slotId: string;
    amount: number;
    sessionGoal: string;
}

export interface ICreateCheckoutSessionOutput {
    url: string;
}