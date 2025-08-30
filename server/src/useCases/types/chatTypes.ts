import { IPsychologistChatConsultationDto, IUserChatConsultationDto } from '../dtos/consultation';

export interface ISendMessageInput {
    clientId: string;
    consultationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    mediaUrl?: string;
    mediaTypes?: string;
}

export interface IGetUserChatConsultationsResponse {
    consultations: IUserChatConsultationDto[];
    totalCount: number;
}

export interface IGetPsychologistChatConsultationsResponse {
    consultations: IPsychologistChatConsultationDto[];
    totalCount: number;
}
