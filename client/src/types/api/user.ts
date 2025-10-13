import type { IConsultationDto } from '../dtos/consultation';
import type { INotificationDto } from '../dtos/notification';
import type { IPlanDto } from '../dtos/plan';
import type { IPsychologistDto, IPsychologistProfileDto } from '../dtos/psychologist';
import type { ISlotDto } from '../dtos/slot';
import type { ISubscriptionDto } from '../dtos/subscription';
import type { BackendResponse } from './api';

export interface IGetAllPsychologistResponseData {
  psychologists: IPsychologistDto[];
  totalCount?: number;
}

export interface IGetAllPsychologistRequest {
  search?: string;
  specialization?: string;
  sort?: 'asc' | 'desc';
  gender: 'Male' | 'Female' | 'all';
  page?: number;
  limit?: number;
  expertise?: string;
}

export interface ICreateCheckoutSessionInput {
  subscriptionId?: string;
  slotId?: string;
  amount: number;
  sessionGoal?: string;
  purpose?: 'consultation' | 'wallet';
}

export interface ICreateCheckoutSessionResponseData {
  url: string;
}

export interface IGetUserProfileResponseData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'psychologist';
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  isActive?: boolean;
}

export interface IGetUserConsultationsRequest {
  search?: string;
  sort?: 'asc' | 'desc';
  status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed' | 'all';
  page?: number;
  limit?: number;
}

export interface IGetUserConsultationHistoryRequest {
  search?: string;
  sort?: 'asc' | 'desc';
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
  status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed';
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
    paymentMethod: 'stripe' | 'wallet';
    paymentStatus: 'pending' | 'succeeded' | 'failed';
    refunded: boolean;
  };
}

export interface IUserConsultationHistoryDetailsResponseData {
  id: string;
  sessionGoal: string;
  status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
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
    paymentMethod: 'stripe' | 'wallet';
    paymentStatus: 'pending' | 'succeeded' | 'failed';
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
export type IUserConsultationDetailsResponse =
  BackendResponse<IUserConsultationDetailsResponseData>;
export type IUserConsultationHistoryDetailResponse =
  BackendResponse<IUserConsultationHistoryDetailsResponseData>;
export type IGetUserProfileResponse = BackendResponse<IGetUserProfileResponseData>;
export type IGetNotificationsResponse = BackendResponse<INotificationDto[]>;
export type IGetActiveSubscriptionResponse = BackendResponse<ISubscriptionDto>;
export type IGetAllPlansResponse = BackendResponse<IPlanDto[]>;
export type ICreateCheckoutSessionResponse = BackendResponse<ICreateCheckoutSessionResponseData>;
export type IGetSlotsByPsychologistResponse = BackendResponse<ISlotDto[]>;
