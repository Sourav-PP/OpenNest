import { ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IGetUserConsultationHistoryUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationHistoryUseCase';
import { toConsultationDto } from '@/useCases/mappers/consultationMapper';
import {
    IGetUserConsultationHistoryRequest,
    IGetUserConsultationHistoryResponse,
} from '@/useCases/types/userTypes';

export class GetUserConsultationHistoryUseCase implements IGetUserConsultationHistoryUseCase {
    private _consultationRepo: IConsultationRepository;

    constructor(consultationRepo: IConsultationRepository) {
        this._consultationRepo = consultationRepo;
    }

    async execute(
        input: IGetUserConsultationHistoryRequest,
    ): Promise<IGetUserConsultationHistoryResponse> {
        const { search, sort, page = 1, limit = 10 } = input;

        const finalSort =
            sort === SortFilter.ASC || sort === SortFilter.DESC
                ? sort
                : SortFilter.DESC;
        const skip = (page - 1) * limit;
        const userId = input.patientId;

        const consultations = await this._consultationRepo.findByPatientId(
            userId,
            {
                search,
                sort: finalSort,
                limit,
                status: ConsultationStatus.COMPLETED,
                skip,
            },
        );

        const mappedConsultations = consultations.map(c =>
            toConsultationDto(c.consultation, c.psychologist, c.user),
        );

        const totalCount =
            await this._consultationRepo.countAllByPatientId(userId);

        return {
            consultations: mappedConsultations,
            totalCount,
        };
    }
}
