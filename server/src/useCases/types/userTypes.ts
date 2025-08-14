import { IConsultationDto } from '../../domain/dtos/consultation';
import { IPsychologistResponseDto } from '../../domain/dtos/psychologist';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: Date;
  profileImage?: string;
  role: 'user' | 'psychologist' | 'admin';
}

export interface IUpdateUserProfileInput {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: Date;
  profileImage?: string;
}

export interface IUpdateUserProfileOutput {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: Date;
    profileImage?: string;
}

export interface IGetUserProfileInput {
  userId: string;
}

export interface IGetUserProfileOutput {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'psychologist';
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: string;
    isActive?: boolean;
}

export interface IGetSlotForUsertInput {
  userId: string; //userId of psychologist
  date?: Date
}
export interface IGetAllPsychologistRequest {
  search?: string;
  sort?: 'asc' | 'desc';
  gender?: 'Male' | 'Female' | 'all',
  expertise?: string  
  page?: number;
  limit?: number;
}

export interface IGetAllPsychologistResponse {
  psychologists: IPsychologistResponseDto[],
  totalCount: number
}
export interface IGetConsultationsRequest {
  patientId: string
  search?: string;
  sort?: 'asc' | 'desc';
  status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled';  
  page?: number;
  limit?: number; 
}

export interface IGetConsultationsResponse {
  consultations: IConsultationDto[],
  totalCount: number
}

