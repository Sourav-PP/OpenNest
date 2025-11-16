import { PaymentMethod, PaymentPurpose, PaymentStatus } from '@/domain/enums/PaymentEnums';

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

export interface ITransactionDto {
    id: string;
    amount: number;
    currency: string;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod
    purpose: PaymentPurpose;
    transactionId?: string;
    createdAt: Date;    
}
