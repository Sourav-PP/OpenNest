export interface Payment {
    id: string;
    userId: string;
    consultationId?: string;
    amount: number;
    currency: string;
    paymentMethod: 'stripe' | 'wallet';
    paymentStatus: 'pending' | 'succeeded' | 'failed';
    refunded: boolean;
    transactionId?: string;
    stripeSessionId?: string;
    slotId: string | null;
    purpose: 'consultation' | 'wallet' | 'subscription';
}