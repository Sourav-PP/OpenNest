import type { ConsultationStatusType } from '@/constants/types/Consultation';
import type { IMessageDto } from './message';
import type { PaymentMethodType, PaymentStatusType } from '@/constants/types/Payment';

export interface ConsultationNotes {
    privateNotes?: string;
    feedback?: string;
    updatedAt?: Date;
}

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
  id: string;
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
  roomId: string;
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
  roomId: string;
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

export interface IRevenueStatDto {
  date: string;
  totalAmount: number;
  adminProfit: number;
  psychologistPayout: number;
}

export interface IPsychologistBookingTrend {
    date: string;
    completed: number;
    cancelled: number;
    booked: number;
}

export interface IClientTrend {
    date: string;
    uniqueUsers: number;
}

export interface IUserTrendDto {
  date: string;
  userCount: number;
  psychologistCount: number;
}

export interface IBookingTrendDto {
  date: string;
  completedOrBooked: number;
  cancelled: number;
}

export interface ITopConsultationDto {
    consultation: {
        id: string;
        startDateTime: Date;
        endDateTime: Date;
        sessionGoal: string;
    };
    patient: {
        id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    rating: number;
    userFeedback?: string;
}
