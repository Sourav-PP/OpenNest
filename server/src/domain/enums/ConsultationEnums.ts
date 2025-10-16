export enum ConsultationStatus {
    BOOKED = 'booked',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    RESCHEDULED = 'rescheduled',
    MISSED = 'missed',
}

export enum ConsultationPaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

export enum ConsultationPaymentMethod {
    STRIPE = 'stripe',
    WALLET = 'wallet',
    SUBSCRIPTION = 'subscription',
}

export type ConsultationStatusFilter = ConsultationStatus | 'all';