import { ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPsychologistConsultationHistoryUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistConsultationHistoryUseCase';
import { toPsychologistConsultationDto } from '@/useCases/mappers/consultationMapper';
import {
    IGetConsultationHistoryRequest,
    IGetConsultationHistoryResponse,
} from '@/useCases/types/psychologistTypes';

export class GetPsychologistConsultationHistoryUseCase implements IGetPsychologistConsultationHistoryUseCase {
    private _consultationRepo: IConsultationRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(
        consultationRepo: IConsultationRepository,
        psychologistRepo: IPsychologistRepository,
    ) {
        this._consultationRepo = consultationRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(
        input: IGetConsultationHistoryRequest,
    ): Promise<IGetConsultationHistoryResponse> {
        const { search, sort, page = 1, limit = 10, psychologistId } = input;

        const psychologist =
            await this._psychologistRepo.findByUserId(psychologistId);

        if (!psychologist) {
            throw new AppError(
                psychologistMessages.ERROR.NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        }

        const finalSort =
            sort === SortFilter.ASC || sort === SortFilter.DESC
                ? sort
                : SortFilter.DESC;
        const skip = (page - 1) * limit;
        const id = psychologist.id;

        const consultations = await this._consultationRepo.findByPsychologistId(
            id,
            {
                search,
                sort: finalSort,
                limit,
                status: ConsultationStatus.COMPLETED,
                skip,
            },
        );
        const mappedConsultations = consultations.map(c =>
            toPsychologistConsultationDto(c.consultation, c.patient, c.payment),
        );

        const totalCount =
            await this._consultationRepo.countAllByPsychologistId(id);

        return {
            consultations: mappedConsultations,
            totalCount,
        };
    }
}
