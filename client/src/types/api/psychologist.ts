import type { IPatientConsultationHistoryDto, IPsychologistConsultationDto } from '../dtos/consultation';
import type { IPayoutRequestDto } from '../dtos/payoutRequest';
import type { BackendResponse } from './api';

export interface IGetUserConsultationsResponse {
  consultations: IPsychologistConsultationDto[];
  totalCount: number;
}

export interface IGetPatientConsultationHistoryResponseData {
  consultations: IPatientConsultationHistoryDto[];
  totalCount: number;
}

export interface IGetPendingPayoutData {
  totalAmount: number;
  commissionAmount: number;
  payoutAmount: number;
  consultationCount: number;
  consultationIds: string[];
}

export interface IRequestPayoutResponseData {
  payoutRequest: IPayoutRequestDto;
}

export interface IGetPayoutHistoryResponseData {
  requests: IPayoutRequestDto[];
  totalCount: number;
}
export interface PsychologistReviewDTO {
  id: string;
  rating: number;
  userFeedback: string;
  createdAt: Date;
  patient: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface IGetPsychologistReviewsResponseData {
  reviews: PsychologistReviewDTO[];
  total: number;
  hasMore: boolean;
}

export type IGetPsychologistConsultationsResponse = BackendResponse<IGetUserConsultationsResponse>;
export type IGetPatientConsultationHistoryResponse = BackendResponse<IGetPatientConsultationHistoryResponseData>;
export type IGetPendingPayoutResponse = BackendResponse<IGetPendingPayoutData>;
export type IRequestPayoutResponse = BackendResponse<IRequestPayoutResponseData>;
export type IGetPayoutHistoryResponse = BackendResponse<IGetPayoutHistoryResponseData>;
export type IGetPsychologistReviewsResponse = BackendResponse<IGetPsychologistReviewsResponseData>
