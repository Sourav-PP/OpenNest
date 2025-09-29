import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IConsultationDetailsForAdminDto } from '@/useCases/dtos/consultation';
import { IGetAllConsultationsUseCase } from '@/useCases/interfaces/admin/management/IGetAllConsultationsUseCase';
import { toConsultationDtoForAdmin } from '@/useCases/mappers/consultationMapper';

export class GetAllConsultationsUseCase implements IGetAllConsultationsUseCase {
    private _consultationRepository: IConsultationRepository;

    constructor(consultationRepository: IConsultationRepository) {
        this._consultationRepository = consultationRepository;
    }

    async execute(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        page?: number;
        limit?: number;
        status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all';
    }): Promise<{consultations: IConsultationDetailsForAdminDto[], totalCount: number}> {
        const { search, sort, page = 1, limit = 10, status = 'all' } = params;

        const finalSort = sort === 'asc' || sort === 'desc' ? sort : 'desc';
        const skip = (page - 1) * limit;  

        const consultations = await this._consultationRepository.findAll({
            search,
            sort: finalSort,  
            limit,
            skip,  
            status,
        });

        const mapped = consultations.map(({ consultation, psychologist, patient, payment }) =>
            toConsultationDtoForAdmin({ consultation, psychologist, patient, payment }),
        );

        console.log('mapped consultations:', mapped);

        const totalCount = await this._consultationRepository.countAll({ search, status });

        console.log('totalCount:', totalCount);

        return {
            consultations: mapped,
            totalCount,
        };
    }
}
