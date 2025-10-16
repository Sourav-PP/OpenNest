import {
    PaymentMethod,
    PaymentPurpose,
    PaymentStatus,
} from '../enums/PaymentEnums';

export interface Payment {
    id: string;
    userId: string;
    consultationId?: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    refunded: boolean;
    transactionId?: string;
    stripeSessionId?: string;
    slotId: string | null;
    purpose: PaymentPurpose;
}
