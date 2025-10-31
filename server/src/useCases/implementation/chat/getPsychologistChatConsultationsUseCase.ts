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
        const { search, psychologistId } = input;

        const psychologist = await this._psychologistRepo.findByUserId(psychologistId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const id = psychologist.id;

        const rooms = await this._consultationRepo.findChatRoomsByPsychologistId(id, {
            search,
        });

        const mappedRooms = rooms.map(r =>
            toPsychologistChatConsultationDto(
                r.roomId,
                r.psychologistId,
                r.patient,
                r.lastMessage,
                r.lastMessageTime,
                r.unreadCount,
            ),
        );

        const totalCount = await this._consultationRepo.countAllByPatientId(id);

        return {
            rooms: mappedRooms,
            totalCount,
        };
    }
}
