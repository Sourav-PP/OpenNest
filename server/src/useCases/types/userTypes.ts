import { IConsultationDto } from '../dtos/consultation';
import { IPsychologistListUserDto } from '../dtos/psychologist';

export interface IUpdateUserProfileInput {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: Date;
  file?: Express.Multer.File;
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

export interface IGetSlotForUserInput {
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
  psychologists: IPsychologistListUserDto[],
  totalCount: number
}
export interface IGetConsultationsRequest {
  patientId: string
  search?: string;
  sort?: 'asc' | 'desc';
  status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all';  
  page?: number;
  limit?: number; 
}

export interface IGetConsultationsResponse {
  consultations: IConsultationDto[],
  totalCount: number
}

export interface IGetUserConsultationHistoryRequest {
  patientId: string
  search?: string;
  sort?: 'asc' | 'desc';  
  page?: number;
  limit?: number;
}

export interface IGetUserConsultationHistoryResponse {
  consultations: IConsultationDto[],
  totalCount: number
}



