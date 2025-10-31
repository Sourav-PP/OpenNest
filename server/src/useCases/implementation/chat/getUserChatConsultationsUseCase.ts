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

    async execute(input: IGetConsultationsRequest): Promise<IGetUserChatConsultationsResponse> {
        const { search, patientId } = input;

        const rooms = await this._consultationRepo.findChatRoomsByPatientId(patientId, {
            search,
        });

        const mappedRooms = rooms.map(r =>
            toUserChatConsultationDto(
                r.roomId,
                r.psychologist,
                r.user,
                r.lastMessage,
                r.lastMessageTime,
                r.unreadCount,
            ),
        );

        const totalCount = await this._consultationRepo.countAllByPatientId(patientId);

        return {
            rooms: mappedRooms,
            totalCount,
        };
    }
}
