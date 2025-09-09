import { Consultation } from '../entities/consultation';
import { Message } from '../entities/message';
import { Payment } from '../entities/payment';
import { Psychologist } from '../entities/psychologist';
import { Slot } from '../entities/slot';
import { User } from '../entities/user';

export interface IConsultationRepository {
    createConsultation(data: Omit<Consultation, 'id'>): Promise<Consultation>;
    isSlotBooked(slotId: string): Promise<boolean>;
    findByPsychologistId(
        psychologistId: string,
        params: {
            search?: string;
            sort?: 'asc' | 'desc';
            skip?: number;
            limit?: number;
            status:
                | 'booked'
                | 'cancelled'
                | 'completed'
                | 'rescheduled'
                | 'all';
        },
    ): Promise<{ consultation: Consultation; patient: User; payment?: Payment; lastMessage?: Message; lastMessageTime?: Date; unreadCount: number }[]>;
    findByPatientId(
        patientId: string,
        params: {
            search?: string;
            sort?: 'asc' | 'desc';
            skip?: number;
            limit?: number;
            status?:
                | 'booked'
                | 'cancelled'
                | 'completed'
                | 'rescheduled'
                | 'all';
        },
    ): Promise<
        { consultation: Consultation; psychologist: Psychologist; user: User; lastMessage?: Message;
                lastMessageTime?: Date;
                unreadCount: number; }[]
    >;
    findById(id: string): Promise<Consultation | null>;
    findByIdWithDetails(id: string): Promise<{ consultation: Consultation, psychologist: Psychologist & User, user: User, slot: Slot, payment: Payment } | null>
    countAllByPatientId(patientId: string): Promise<number>;
    countAllByPsychologistId(psychologistId: string): Promise<number>
    update(consultation: Consultation): Promise<Consultation | null>;
}
