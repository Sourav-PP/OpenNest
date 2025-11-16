import { Payment } from '../entities/payment';

export interface IPaymentRepository {
    create(paymentData: Omit<Payment, 'id'>): Promise<Payment>
    deleteById(id: string): Promise<boolean>
    updateBySessionId(sessionId: string, update: Partial<Payment>): Promise<Payment | null>
    findBySessionId(sessionId: string): Promise<Payment | null>
    findById(id: string): Promise<Payment | null>;
    fndByUserId(input: { userId: string, page: number, limit: number }): Promise<Payment[]>;
    findByConsultationId(id: string):  Promise<Payment | null>;
    findByConsultationIds(ids: string[]): Promise<Payment[]>;
    sumPaidAmounts(): Promise<number>;
    findPendingPayments(date: Date): Promise<Payment[]>
    countAll(userId: string): Promise<number>;
}