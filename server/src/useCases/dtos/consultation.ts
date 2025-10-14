import { Message } from '@/domain/entities/message';

export interface IConsultationDto {
    id?: string;
    patientId: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed';
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
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed';
    meetingLink?: string;
    psychologistId: string;
    patient: {
        id: string;
        name: string;
        profileImage?: string;
    };
    payment?: {
        amount: number;
        currency: string;
        paymentMethod: 'stripe' | 'wallet' | null;
        paymentStatus: 'pending' | 'succeeded' | 'failed';
        refunded: boolean;
    };
}

export interface IPatientConsultationHistoryDto {
    id?: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed';
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
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed';
    patientId: string;
    psychologist: {
        id: string;
        userId: string;
        name: string;
        profileImage?: string;
    };
    lastMessage?: Partial<Message>;
    lastMessageTime?: Date;
    unreadCount: number;
}

export interface IPsychologistChatConsultationDto {
    id?: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed';
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

export interface IConsultationHistoryDetailsDto {
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
    video: {
        duration?: number;
        startedAt: Date | null;
        endedAt: Date | null;
    }
}


export interface IConsultationDetailsForAdminDto {
    id: string;
    patientName: string;
    patientProfileImage?: string;
    psychologistName: string;
    psychologistProfileImage?: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'missed';
    paymentStatus?: 'pending' | 'succeeded' | 'failed';
    paymentMethod?: 'stripe' | 'wallet' | null;
}
