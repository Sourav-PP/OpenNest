import { ConsultationStatusFilter } from '@/domain/enums/ConsultationEnums';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
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
        sort?: SortFilter;
        page?: number;
        limit?: number;
        status?: ConsultationStatusFilter;
    }): Promise<{
        consultations: IConsultationDetailsForAdminDto[];
        totalCount: number;
    }> {
        const { search, sort, page = 1, limit = 10, status = 'all' } = params;

        const finalSort =
            sort === SortFilter.ASC || sort === SortFilter.DESC
                ? sort
                : SortFilter.DESC;
        const skip = (page - 1) * limit;

        const consultations =
            await this._consultationRepository.findAllWithDetails({
                search,
                sort: finalSort,
                limit,
                skip,
                status,
            });

        const mapped = consultations.map(
            ({ consultation, psychologist, patient, payment }) =>
                toConsultationDtoForAdmin({
                    consultation,
                    psychologist,
                    patient,
                    payment,
                }),
        );

        const totalCount = await this._consultationRepository.countAll({
            search,
            status,
        });

        return {
            consultations: mapped,
            totalCount,
        };
    }
}
