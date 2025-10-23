import { Payment } from '../entities/payment';

export interface IPaymentRepository {
    create(paymentData: Omit<Payment, 'id'>): Promise<Payment>
    updateBySessionId(sessionId: string, update: Partial<Payment>): Promise<Payment | null>
    findBySessionId(sessionId: string): Promise<Payment | null>
    findById(id: string): Promise<Payment | null>;
    findByConsultationId(id: string):  Promise<Payment | null>;
    findByConsultationIds(ids: string[]): Promise<Payment[]>;
    sumPaidAmounts(): Promise<number>;
}