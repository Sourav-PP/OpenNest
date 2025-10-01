import type { IPatientConsultationHistoryDto, IPsychologistConsultationDto } from '../dtos/consultation';
import type { BackendResponse } from './api';

export interface IGetUserConsultationsResponse {
  consultations: IPsychologistConsultationDto[];
  totalCount: number;
}

export interface IGetPatientConsultationHistoryResponseData {
  consultations: IPatientConsultationHistoryDto[];
  totalCount: number;
}

export type IGetPsychologistConsultationsResponse = BackendResponse<IGetUserConsultationsResponse>;
export type IGetPatientConsultationHistoryResponse = BackendResponse<IGetPatientConsultationHistoryResponseData>
