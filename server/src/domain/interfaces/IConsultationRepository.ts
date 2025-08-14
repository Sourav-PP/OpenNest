import { Consultation } from '../entities/consultation';
import { IConsultationDto } from '../dtos/consultation';

export interface IConsultationRepository {
    createConsultation(data: Consultation): Promise<Consultation>
    isSlotBooked(slotId: string): Promise<boolean>
    findByPatientId(patientId: string, params:{
        search?: string,
        sort?:'asc' | 'desc',
        skip?: number,
        limit?: number,
        status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled'
    }): Promise<IConsultationDto[]>
    countAllByPatientId(patientId: string): Promise<number>
}