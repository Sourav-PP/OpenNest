import { Complaint } from '../entities/complaint';

export interface IComplaintRepository {
    create(data: Omit<Complaint, 'id'>): Promise<Complaint>;
    findByConsultationId(consultationId: string): Promise<Complaint | null>;
}
