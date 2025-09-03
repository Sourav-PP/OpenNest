export interface ICreateCheckoutSessionInput {
    userId: string;
    subscriptionId?: string;
    slotId: string;
    amount: number;
    sessionGoal: string;
    purpose: 'consultation' | 'wallet';
}

export interface ICreateCheckoutSessionOutput {
    url: string;
}