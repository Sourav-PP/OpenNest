import { ConsultationNotes } from '@/domain/entities/consultation';
import { Message } from '@/domain/entities/message';
import { ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { PaymentMethod, PaymentStatus } from '@/domain/enums/PaymentEnums';

export interface IConsultationDto {
    id?: string;
    patientId: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: ConsultationStatus;
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
    status: ConsultationStatus;
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
        paymentMethod: PaymentMethod;
        paymentStatus: PaymentStatus;
        refunded: boolean;
    };
}

export interface IPatientConsultationHistoryDto {
    id?: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: ConsultationStatus;
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
    status: ConsultationStatus;
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
    status: ConsultationStatus;
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
    status: ConsultationStatus;
    meetingLink?: string;
    startDateTime: Date;
    endDateTime: Date;
    notes?: ConsultationNotes;
    rating?: number,
    userFeedback?: string,
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
        paymentMethod: PaymentMethod;
        paymentStatus: PaymentStatus;
        refunded: boolean;
    } | null;
}

export interface IConsultationHistoryDetailsDto {
    id: string;
    sessionGoal: string;
    status: ConsultationStatus;
    meetingLink?: string;
    startDateTime: Date;
    endDateTime: Date;
    notes?: ConsultationNotes;
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
        paymentMethod: PaymentMethod;
        paymentStatus: PaymentStatus;
        refunded: boolean;
    } | null;
    video: {
        duration?: number;
        startedAt: Date | null;
        endedAt: Date | null;
    };
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
    status: ConsultationStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
}
