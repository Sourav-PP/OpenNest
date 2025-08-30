import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IGetUserChatConsultationsUseCase } from '@/useCases/interfaces/chat/IGetUserChatConsultationsUseCase';
import { toUserChatConsultationDto } from '@/useCases/mappers/consultationMapper';
import { IGetUserChatConsultationsResponse } from '@/useCases/types/chatTypes';
import { IGetConsultationsRequest } from '@/useCases/types/userTypes';

export class GetUserChatConsultationsUseCase implements IGetUserChatConsultationsUseCase {
    private _consultationRepo: IConsultationRepository;

    constructor(consultationRepo: IConsultationRepository) {
        this._consultationRepo = consultationRepo;
    }

    async execute(
        input: IGetConsultationsRequest,
    ): Promise<IGetUserChatConsultationsResponse> {
        const { search, sort, status, page = 1, limit = 10 } = input;

        const finalSort = sort === 'asc' || sort === 'desc' ? sort : 'desc';
        const skip = (page - 1) * limit;
        const userId = input.patientId;

        const consultations = await this._consultationRepo.findByPatientId(
            userId,
            {
                search,
                sort: finalSort,
                limit,
                status,
                skip,
            },
        );

        const mappedConsultations = consultations.map(c =>
            toUserChatConsultationDto(c.consultation, c.psychologist, c.user, c.lastMessage, c.lastMessageTime, c.unreadCount),
        );

        const totalCount = await this._consultationRepo.countAllByPatientId(userId);

        return {
            consultations: mappedConsultations,
            totalCount,
        };
    }
}
