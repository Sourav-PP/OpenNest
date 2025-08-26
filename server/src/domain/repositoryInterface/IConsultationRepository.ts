import { Consultation } from '../entities/consultation';
import { Psychologist } from '../entities/psychologist';
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
    ): Promise<{ consultation: Consultation; patient: User }[]>;
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
        { consultation: Consultation; psychologist: Psychologist; user: User }[]
    >;
    findById(id: string): Promise<Consultation | null>;
    countAllByPatientId(patientId: string): Promise<number>;
    countAllByPsychologistId(psychologistId: string): Promise<number>
}
