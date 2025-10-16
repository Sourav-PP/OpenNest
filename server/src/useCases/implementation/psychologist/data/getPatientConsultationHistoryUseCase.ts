import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPatientConsultationHistoryUseCase } from '@/useCases/interfaces/psychologist/data/IGetPatientConsultationHistoryUseCase';
import { toPatientConsultationHistoryDto } from '@/useCases/mappers/consultationMapper';
import {
    IGetPatientConsultationHistoryRequest,
    IGetPatientConsultationHistoryResponse,
} from '@/useCases/types/psychologistTypes';

export class GetPatientConsultationHistoryUseCase implements IGetPatientConsultationHistoryUseCase {
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
        input: IGetPatientConsultationHistoryRequest,
    ): Promise<IGetPatientConsultationHistoryResponse> {
        const {
            search,
            sort,
            page = 1,
            limit = 10,
            patientId,
            psychologistUserId,
        } = input;

        const psychologist =
            await this._psychologistRepo.findByUserId(psychologistUserId);

        if (!psychologist) {
            throw new AppError(
                psychologistMessages.ERROR.NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        }

        const finalSort = sort === SortFilter.ASC || sort === SortFilter.DESC ? sort : SortFilter.DESC;
        const skip = (page - 1) * limit;
        const psychologistId = psychologist.id;

        const consultations = await this._consultationRepo.findPatientHistory(
            psychologistId,
            patientId,
            {
                search,
                sort: finalSort,
                limit,
                skip,
            },
        );
        const mappedConsultations = consultations.map(c =>
            toPatientConsultationHistoryDto(c.consultation, c.patient),
        );

        const totalCount = await this._consultationRepo.countPatientHistory(
            psychologistId,
            patientId,
        );

        return {
            consultations: mappedConsultations,
            totalCount,
        };
    }
}
