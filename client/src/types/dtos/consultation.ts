import type { IMessageDto } from './message';

export interface IConsultationDto {
  id: string;
  patientId: string;
  startDateTime: string;
  endDateTime: string;
  sessionGoal: string;
  status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
  meetingLink?: string;
  unreadCount: number;
  psychologist: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export interface IPsychologistConsultationDto {
  id: string;
  patientId: string;
  startDateTime: string;
  endDateTime: string;
  sessionGoal: string;
  status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
  meetingLink?: string;
  unreadCount: number;
  patient: {
    id: string;
    name: string;
    profileImage: string;
  };
}

//chat consultations
export interface IUserChatConsultationDto {
  id: string;
  status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
  patientId: string;
  psychologist: {
    id: string;
    name: string;
    profileImage?: string;
  };
  lastMessage?: Partial<IMessageDto>;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface IPsychologistChatConsultationDto {
  id: string;
  status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
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
