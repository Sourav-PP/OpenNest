import type { ConsultationStatusType } from '@/constants/Consultation';
import type { IMessageDto } from './message';
import type { PaymentMethodType, PaymentStatusType } from '@/constants/Payment';

export interface IConsultationDto {
  id: string;
  patientId: string;
  startDateTime: string;
  endDateTime: string;
  sessionGoal: string;
  status?: ConsultationStatusType;
  meetingLink?: string;
  unreadCount: number;
  psychologist: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export interface IConsultationDtoForAdmin {
  id: string;
  patientName: string;
  patientProfileImage?: string;
  psychologistName: string;
  psychologistProfileImage?: string;
  startDateTime: string;
  endDateTime: string;
  sessionGoal: string;
  status: ConsultationStatusType;
  paymentStatus: PaymentStatusType | null;
  paymentMethod: PaymentMethodType | null;
}

export interface IPsychologistConsultationDto {
  id: string;
  patientId: string;
  startDateTime: string;
  endDateTime: string;
  sessionGoal: string;
  status?: ConsultationStatusType;
  meetingLink?: string;
  unreadCount: number;
  patient: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export interface IPatientConsultationHistoryDto {
  id?: string;
  startDateTime: Date;
  endDateTime: Date;
  sessionGoal: string;
  status: ConsultationStatusType;
  meetingLink?: string;
  psychologistId: string;
  patient: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

//chat consultations
export interface IUserChatConsultationDto {
  id: string;
  status: ConsultationStatusType;
  patientId: string;
  psychologist: {
    id: string;
    userId: string;
    name: string;
    profileImage?: string;
  };
  lastMessage?: Partial<IMessageDto>;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface IPsychologistChatConsultationDto {
  id: string;
  status: ConsultationStatusType;
  psychologistId: string;
  patient: {
    id: string;
    name: string;
    profileImage?: string;
  };
  lastMessage?: Partial<IMessageDto>;
  lastMessageTime?: string;
  unreadCount: number;
}
