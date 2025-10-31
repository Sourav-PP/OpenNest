import {
    IPsychologistChatConsultationDto,
    IUserChatConsultationDto,
} from '../dtos/consultation';

export interface ISendMessageInput {
    clientId: string;
    roomId: string;
    senderId: string;
    receiverId: string;
    content: string;
    mediaUrl?: string;
    mediaType?: string;
}

export interface IGetUserChatConsultationsResponse {
    rooms: IUserChatConsultationDto[];
    totalCount: number;
}

export interface IGetPsychologistChatConsultationsResponse {
    rooms: IPsychologistChatConsultationDto[];
    totalCount: number;
}
