import { ClientSession } from 'mongoose';
import { Consultation } from '../entities/consultation';
import { Message } from '../entities/message';
import { Payment } from '../entities/payment';
import { Psychologist } from '../entities/psychologist';
import { Slot } from '../entities/slot';
import { User } from '../entities/user';

export interface IConsultationRepository {
    create(data: Omit<Consultation, 'id'>): Promise<Consultation>;
    isSlotBooked(slotId: string): Promise<boolean>;
    findPatientHistory(
        psychologistId: string,
        patientId: string,
        params: {
            search?: string;
            sort?: 'asc' | 'desc';
            skip?: number;
            limit?: number;
        },
    ): Promise<{ consultation: Consultation; patient: User }[]>;
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
    findByIds(ids: string[]): Promise<Consultation[]>;
    findByIdWithDetails(id: string): Promise<{ consultation: Consultation, psychologist: Psychologist & User, user: User, slot: Slot, payment: Payment } | null>
    countAllByPatientId(patientId: string): Promise<number>;
    countAllByPsychologistId(psychologistId: string): Promise<number>
    countPatientHistory(psychologistId: string, patientId: string): Promise<number>;
    update(consultation: Consultation): Promise<Consultation | null>;
    updateConsultation(id: string, update: Partial<Consultation>): Promise<Consultation | null>;
    findAllWithDetails(params: {
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
    }): Promise<{ consultation: Consultation; psychologist: Psychologist & User; patient: User; payment?: Payment;}[]>;
    countAll(params: { search?: string; status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all' }): Promise<number>;
    findByPatientAndPsychologistId(patientId: string, psychologistId: string): Promise<Consultation[]>;
    findUnpaidCompletedConsultationsByPsychologistId(psychologistId: string): Promise<Consultation[]>;
    markIncludedInPayout(consultationIds: string[], session?: ClientSession): Promise<void>;
}
