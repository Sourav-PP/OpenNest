import { ConsultationStatusFilter } from '@/domain/enums/ConsultationEnums';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { IConsultationDetailsForAdminDto } from '@/useCases/dtos/consultation';

export interface IGetAllConsultationsUseCase {
    execute(params: {
        search?: string;
        sort?: SortFilter;
        page?: number;
        limit?: number;
        status?: ConsultationStatusFilter;
    }): Promise<{consultations: IConsultationDetailsForAdminDto[], totalCount: number}>;
}
