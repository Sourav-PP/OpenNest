import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPsychologistChatConsultationsUseCase } from '@/useCases/interfaces/chat/IGetPsychologistChatConsultationsUseCase';
import { toPsychologistChatConsultationDto } from '@/useCases/mappers/consultationMapper';
import { IGetPsychologistChatConsultationsResponse } from '@/useCases/types/chatTypes';
import { IGetConsultationsRequest } from '@/useCases/types/psychologistTypes';

export class GetPsychologistChatConsultationsUseCase implements IGetPsychologistChatConsultationsUseCase {
    private _consultationRepo: IConsultationRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(consultationRepo: IConsultationRepository, psychologistRepo: IPsychologistRepository) {
        this._consultationRepo = consultationRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(input: IGetConsultationsRequest): Promise<IGetPsychologistChatConsultationsResponse> {
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
            toPsychologistChatConsultationDto(
                c.consultation,
                c.patient,
                c.lastMessage,
                c.lastMessageTime,
                c.unreadCount,
            ),
        );

        const totalCount = await this._consultationRepo.countAllByPatientId(id);

        return {
            consultations: mappedConsultations,
            totalCount,
        };
    }
}
