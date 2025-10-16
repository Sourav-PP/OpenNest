import { PaymentPurpose } from '@/domain/enums/PaymentEnums';

export interface ICreateCheckoutSessionInput {
    userId: string;
    subscriptionId?: string;
    slotId: string;
    amount: number;
    sessionGoal: string;
    purpose: PaymentPurpose;
}

export interface ICreateCheckoutSessionOutput {
    url: string;
}
