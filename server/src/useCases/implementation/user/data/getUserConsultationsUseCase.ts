import { IGetUserConsultationUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationsUseCase';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IGetConsultationsRequest, IGetConsultationsResponse } from '@/useCases/types/userTypes';
import { toConsultationDto } from '@/useCases/mappers/consultationMapper';

export class GetUserConsultationsUseCase implements IGetUserConsultationUseCase {
    private _consultationRepo: IConsultationRepository;

    constructor(consultationRepo: IConsultationRepository) {
        this._consultationRepo = consultationRepo;
    }

    async execute(input: IGetConsultationsRequest): Promise<IGetConsultationsResponse> {
        const { search, sort, status, page = 1, limit = 10 } = input;

        const finalSort = (sort === 'asc' || sort === 'desc') ? sort : 'desc';
        const skip = (page - 1) * limit;
        const userId = input.patientId;

        const consultations = await this._consultationRepo.findByPatientId(userId, {
            search,
            sort: finalSort,
            limit,
            status,
            skip,
        });


        const mappedConsultations = consultations.map(c => toConsultationDto(c.consultation, c.psychologist, c.user));

        const totalCount = await this._consultationRepo.countAllByPatientId(userId);

        return {
            consultations: mappedConsultations,
            totalCount,
        };
    }
}