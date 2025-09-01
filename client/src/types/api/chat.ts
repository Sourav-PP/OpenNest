import type { IPsychologistChatConsultationDto, IUserChatConsultationDto } from '../dtos/consultation';
import type { IMessageDto } from '../dtos/message';
import type { BackendResponse } from './api';

export interface IGetChatByPsychologistResponseData {
  consultations: IPsychologistChatConsultationDto[];
  totalCount: number;
}

export interface IGetChatByPatientResponseData {
  consultations: IUserChatConsultationDto[];
  totalCount: number;
}

export interface IGetChatHistoryResponseData {
  messages: IMessageDto[];
}

export interface IChatError {
  status: number;
  message: string;
}





export type IGetChatByPsychologistResponse = BackendResponse<IGetChatByPsychologistResponseData>;
export type IGetChatByPatientResponse = BackendResponse<IGetChatByPatientResponseData>;
export type IGetChatHistoryResponse = BackendResponse<IGetChatHistoryResponseData>;