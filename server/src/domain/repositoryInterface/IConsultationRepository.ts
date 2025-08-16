import { Consultation } from '../entities/consultation';
import { Psychologist } from '../entities/psychologist';
import { User } from '../entities/user';

export interface IConsultationRepository {
    createConsultation(data: Omit<Consultation, 'id'>): Promise<Consultation>
    isSlotBooked(slotId: string): Promise<boolean>
    findByPatientId(patientId: string, params:{
        search?: string,
        sort?:'asc' | 'desc',
        skip?: number,
        limit?: number,
        status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled'
    }): Promise<{ consultation: Consultation; psychologist: Psychologist; user: User }[]>
    countAllByPatientId(patientId: string): Promise<number>
}