import type { IPsychologistConsultationDto } from '../dtos/consultation';
import type { BackendResponse } from './api';

export interface IGetUserConsultationsResponse {
  consultations: IPsychologistConsultationDto[];
  totalCount: number;
}

export type IGetPsychologistConsultationsResponse = BackendResponse<IGetUserConsultationsResponse>;
