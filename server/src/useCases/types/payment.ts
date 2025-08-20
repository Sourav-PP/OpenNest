export interface ICreateCheckoutSessionInput {
    userId: string;
    subscriptionId?: string;
    slotId: string;
    amount: number;
    sessionGoal: string;
}

export interface ICreateCheckoutSessionOutput {
    url: string;
}