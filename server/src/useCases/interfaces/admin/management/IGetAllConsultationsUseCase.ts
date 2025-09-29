import { IConsultationDetailsForAdminDto } from '@/useCases/dtos/consultation';

export interface IGetAllConsultationsUseCase {
    execute(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        page?: number;
        limit?: number;
        status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all';
    }): Promise<{consultations: IConsultationDetailsForAdminDto[], totalCount: number}>;
}
