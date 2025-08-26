import type { IConsultationDto, IPsychologistConsultationDto } from '../dtos/consultation';
import type { IMessageDto } from '../dtos/message';
import type { BackendResponse } from './api';

export interface IGetChatByPsychologistResponseData {
  consultations: IPsychologistConsultationDto[];
  totalCount: number;
}

export interface IGetChatByPatientResponseData {
  consultations: IConsultationDto[];
  totalCount: number;
}

export interface IGetChatHistoryResponseData {
  messages: IMessageDto[];
}



export type IGetChatByPsychologistResponse = BackendResponse<IGetChatByPsychologistResponseData>;
export type IGetChatByPatientResponse = BackendResponse<IGetChatByPatientResponseData>;
export type IGetChatHistoryResponse = BackendResponse<IGetChatHistoryResponseData>;