import { Payment } from '../entities/payment';

export interface IPaymentRepository {
    create(paymentData: Omit<Payment, 'id'>): Promise<Payment>
    updateBySessionId(sessionId: string, update: Partial<Payment>): Promise<Payment | null>
    findBySessionId(sessionId: string): Promise<Payment | null>
}