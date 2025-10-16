import type { ConsultationStatusFilterType, ConsultationStatusType } from '@/constants/Consultation';
import type { IConsultationDto } from '../dtos/consultation';
import type { INotificationDto } from '../dtos/notification';
import type { IPlanDto } from '../dtos/plan';
import type { IPsychologistDto, IPsychologistProfileDto } from '../dtos/psychologist';
import type { ISlotDto } from '../dtos/slot';
import type { ISubscriptionDto } from '../dtos/subscription';
import type { BackendResponse } from './api';
import type { SortFilterType } from '@/constants/SortFilter';
import type { UserGenderFilterType, UserGenderType, UserRoleType } from '@/constants/User';
import type { PaymentMethodType, PaymentPurposeType, PaymentStatusType } from '@/constants/Payment';

export interface IGetAllPsychologistResponseData {
  psychologists: IPsychologistDto[];
  totalCount?: number;
}

export interface IGetAllPsychologistRequest {
  search?: string;
  specialization?: string;
  sort?: SortFilterType;
  gender: UserGenderFilterType;
  page?: number;
  limit?: number;
  expertise?: string;
}

export interface ICreateCheckoutSessionInput {
  subscriptionId?: string;
  slotId?: string;
  amount: number;
  sessionGoal?: string;
  purpose?: PaymentPurposeType;
}

export interface ICreateCheckoutSessionResponseData {
  url: string;
}

export interface IGetUserProfileResponseData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRoleType;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: UserGenderType;
  isActive?: boolean;
}

export interface IGetUserConsultationsRequest {
  search?: string;
  sort?: SortFilterType;
  status: ConsultationStatusFilterType;
  page?: number;
  limit?: number;
}

export interface IGetUserConsultationHistoryRequest {
  search?: string;
  sort?: SortFilterType;
  page?: number;
  limit?: number;
}

export interface IGetUserConsultationsResponseData {
  consultations: IConsultationDto[];
  totalCount: number;
}

export interface IUserConsultationDetailsResponseData {
  id: string;
  sessionGoal: string;
  status: ConsultationStatusType;
  meetingLink?: string;
  startDateTime: Date;
  endDateTime: Date;

  psychologist: {
    id: string;
    name: string;
    profileImage?: string;
  };
  patient: {
    id: string;
    name: string;
    profileImage?: string;
  };
  slot: {
    id: string;
    startDateTime: Date;
    endDateTime: Date;
    isBooked: boolean;
    bookedBy?: string | null;
  };
  payment: {
      amount: number;
      currency: string;
      paymentMethod: PaymentMethodType;
      paymentStatus: PaymentStatusType;
      refunded: boolean;
  } | null;
}

export interface IUserConsultationHistoryDetailsResponseData {
  id: string;
  sessionGoal: string;
  status: ConsultationStatusType;
  meetingLink?: string;
  startDateTime: Date;
  endDateTime: Date;

  psychologist: {
    id: string;
    name: string;
    profileImage?: string;
  };
  patient: {
    id: string;
    name: string;
    profileImage?: string;
  };
  slot: {
    id: string;
    startDateTime: Date;
    endDateTime: Date;
    isBooked: boolean;
    bookedBy?: string | null;
  };
  payment: {
    amount: number;
    currency: string;
    paymentMethod: PaymentMethodType;
    paymentStatus: PaymentStatusType;
    refunded: boolean;
  };
  video: {
    duration?: number;
    startedAt: Date | null;
    endedAt: Date | null;
  };
}

export interface IGetPsychologistByIdResponseData {
  psychologist: IPsychologistProfileDto;
}

export type IGetAllPsychologistResponse = BackendResponse<IGetAllPsychologistResponseData>;
export type IGetPsychologistByIdResponse = BackendResponse<IGetPsychologistByIdResponseData>;
export type IGetUserConsultationsResponse = BackendResponse<IGetUserConsultationsResponseData>;
export type IUserConsultationDetailsResponse = BackendResponse<IUserConsultationDetailsResponseData>;
export type IUserConsultationHistoryDetailResponse = BackendResponse<IUserConsultationHistoryDetailsResponseData>;
export type IGetUserProfileResponse = BackendResponse<IGetUserProfileResponseData>;
export type IGetNotificationsResponse = BackendResponse<INotificationDto[]>;
export type IGetActiveSubscriptionResponse = BackendResponse<ISubscriptionDto>;
export type IGetAllPlansResponse = BackendResponse<IPlanDto[]>;
export type ICreateCheckoutSessionResponse = BackendResponse<ICreateCheckoutSessionResponseData>;
export type IGetSlotsByPsychologistResponse = BackendResponse<ISlotDto[]>;
