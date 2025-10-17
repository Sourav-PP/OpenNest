import { IGetPsychologistConsultationUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistConsultationsUseCase';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { toPsychologistConsultationDto } from '@/useCases/mappers/consultationMapper';
import { IGetConsultationsRequest, IGetConsultationsResponse } from '@/useCases/types/psychologistTypes';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { AppError } from '@/domain/errors/AppError';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { SortFilter } from '@/domain/enums/SortFilterEnum';

export class GetPsychologistConsultationUseCase implements IGetPsychologistConsultationUseCase {
    private _consultationRepo: IConsultationRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(consultationRepo: IConsultationRepository, psychologistRepo: IPsychologistRepository) {
        this._consultationRepo = consultationRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(input: IGetConsultationsRequest): Promise<IGetConsultationsResponse> {
        const { search, sort, status, page = 1, limit = 10, psychologistId } = input;

        const psychologist = await this._psychologistRepo.findByUserId(psychologistId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const finalSort = sort === SortFilter.ASC || sort === SortFilter.DESC ? sort : SortFilter.DESC;
        const skip = (page - 1) * limit;
        const id = psychologist.id;

        const consultations = await this._consultationRepo.findByPsychologistId(id, {
            search,
            sort: finalSort,
            limit,
            status,
            skip,
        });
        const mappedConsultations = consultations.map(c =>
            toPsychologistConsultationDto(c.consultation, c.patient, c.payment),
        );

        const totalCount = await this._consultationRepo.countAllByPsychologistId(id);

        return {
            consultations: mappedConsultations,
            totalCount,
        };
    }
}
