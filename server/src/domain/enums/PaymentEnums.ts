export enum PaymentMethod {
    STRIPE = 'stripe',
    WALLET = 'wallet',
}

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
}

export enum PaymentPurpose {
    CONSULTATION = 'consultation',
    WALLET = 'wallet',
    SUBSCRIPTION = 'subscription',
}