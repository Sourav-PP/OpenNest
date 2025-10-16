import { UserGender, UserGenderFilter, UserRole } from '@/domain/enums/UserEnums';
import { IConsultationDto } from '../dtos/consultation';
import { IPsychologistListUserDto } from '../dtos/psychologist';
import { SortFilter } from '@/domain/enums/SortFilterEnum';
import { ConsultationStatusFilter } from '@/domain/enums/ConsultationEnums';

export interface IUpdateUserProfileInput {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: UserGender;
  dateOfBirth?: Date;
  file?: Express.Multer.File;
}

export interface IUpdateUserProfileOutput {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: UserGender;
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
    role: UserRole;
    profileImage?: string;
    dateOfBirth?: Date;
    gender?: UserGender;
    isActive?: boolean;
}

export interface IGetSlotForUserInput {
  userId: string; //userId of psychologist
  date?: Date
}
export interface IGetAllPsychologistRequest {
  search?: string;
  sort?: SortFilter;
  gender?: UserGenderFilter,
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
  sort?: SortFilter;
  status: ConsultationStatusFilter;  
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
  sort?: SortFilter;  
  page?: number;
  limit?: number;
}

export interface IGetUserConsultationHistoryResponse {
  consultations: IConsultationDto[],
  totalCount: number
}



