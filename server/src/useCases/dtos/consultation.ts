import { Message } from '@/domain/entities/message';

export interface IConsultationDto {
    id?: string;
    patientId: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    meetingLink?: string;
    psychologist: {
        id: string;
        name: string;
        profileImage?: string;
    };
}

export interface IPsychologistConsultationDto {
    id?: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    meetingLink?: string;
    psychologistId: string;
    patient: {
        id: string;
        name: string;
        profileImage?: string;
    };
}

// chat consultations
export interface IUserChatConsultationDto {
    id?: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    patientId: string;
    psychologist: {
        id: string;
        name: string;
        profileImage?: string;
    };
    lastMessage?: Partial<Message>;
    lastMessageTime?: Date;
    unreadCount: number;
}

export interface IPsychologistChatConsultationDto {
    id?: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    psychologistId: string;
    patient: {
        id: string;
        name: string;
        profileImage?: string;
    };
    lastMessage?: Partial<Message>;
    lastMessageTime?: Date;
    unreadCount: number;
}

export interface IUserConsultationDetailsDto {
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
}
