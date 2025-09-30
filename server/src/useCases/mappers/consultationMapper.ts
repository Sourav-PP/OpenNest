import {
    IConsultationDetailsForAdminDto,
    IConsultationDto,
    IConsultationHistoryDetailsDto,
    IPsychologistChatConsultationDto,
    IPsychologistConsultationDto,
    IUserChatConsultationDto,
    IUserConsultationDetailsDto,
} from '../dtos/consultation';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';
import { Consultation } from '@/domain/entities/consultation';
import { Message } from '@/domain/entities/message';
import { Slot } from '@/domain/entities/slot';
import { Payment } from '@/domain/entities/payment';
import { VideoCall } from '@/domain/entities/videoCall';

export function toConsultationDto(
    consultation: Consultation,
    psychologist: Psychologist,
    user: User,
): IConsultationDto {
    return {
        id: consultation.id,
        patientId: consultation.patientId,
        startDateTime: consultation.startDateTime,
        endDateTime: consultation.endDateTime,
        sessionGoal: consultation.sessionGoal,
        status: consultation.status,
        meetingLink: consultation.meetingLink,
        psychologist: {
            id: psychologist.id,
            name: user.name,
            profileImage: user.profileImage,
        },
    };
}

export function toPsychologistConsultationDto(
    consultation: Consultation,
    patient: User,
    payment?: Payment,
): IPsychologistConsultationDto {
    return {
        id: consultation.id,
        psychologistId: consultation.psychologistId,
        startDateTime: consultation.startDateTime,
        endDateTime: consultation.endDateTime,
        sessionGoal: consultation.sessionGoal,
        status: consultation.status,
        meetingLink: consultation.meetingLink,
        patient: {
            id: patient.id,
            name: patient.name,
            profileImage: patient.profileImage,
        },
        payment: payment
            ? {
                amount: payment.amount,
                currency: payment.currency,
                paymentMethod: payment.paymentMethod,
                paymentStatus: payment.paymentStatus,
                refunded: payment.refunded,
            }
            : undefined,
    };
}

// chat consultation mappers
export function toUserChatConsultationDto(
    consultation: Consultation,
    psychologist: Psychologist,
    user: User,
    lastMessage?: Message,
    lastMessageTime?: Date,
    unreadCount: number = 0,
): IUserChatConsultationDto {
    return {
        id: consultation.id,
        status: consultation.status,
        patientId: consultation.patientId,
        psychologist: {
            id: psychologist.id,
            name: user.name,
            profileImage: user.profileImage,
        },
        lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                senderId: lastMessage.senderId,
                receiverId: lastMessage.receiverId,
            }
            : undefined,
        lastMessageTime,
        unreadCount,
    };
}

export function toPsychologistChatConsultationDto(
    consultation: Consultation,
    patient: User,
    lastMessage?: Message,
    lastMessageTime?: Date,
    unreadCount: number = 0,
): IPsychologistChatConsultationDto {
    return {
        id: consultation.id,
        status: consultation.status,
        psychologistId: consultation.psychologistId,
        patient: {
            id: patient.id,
            name: patient.name,
            profileImage: patient.profileImage,
        },
        lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                senderId: lastMessage.senderId,
                receiverId: lastMessage.receiverId,
            }
            : undefined,
        lastMessageTime,
        unreadCount,
    };
}

export function toUserConsultationDetail(
    consultation: Consultation,
    psychologist: Psychologist & User,
    user: User,
    slot: Slot,
    payment: Payment,
): IUserConsultationDetailsDto {
    return {
        id: consultation.id,
        sessionGoal: consultation.sessionGoal,
        status: consultation.status,
        meetingLink: consultation.meetingLink,
        startDateTime: consultation.startDateTime,
        endDateTime: consultation.endDateTime,

        psychologist: {
            id: psychologist.id,
            name: psychologist.name,
            profileImage: psychologist.profileImage,
        },
        patient: {
            id: user.id,
            name: user.name,
            profileImage: user.profileImage,
        },
        slot: {
            id: slot.id,
            startDateTime: slot.startDateTime,
            endDateTime: slot.endDateTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy,
        },
        payment: {
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            paymentStatus: payment.paymentStatus,
            refunded: payment.refunded,
        },
    };
}

export function toConsultationHistoryDetails(
    consultation: Consultation,
    psychologist: Psychologist & User,
    user: User,
    slot: Slot,
    payment: Payment,
    video: VideoCall,
): IConsultationHistoryDetailsDto {
    return {
        id: consultation.id,
        sessionGoal: consultation.sessionGoal,
        status: consultation.status,
        meetingLink: consultation.meetingLink,
        startDateTime: consultation.startDateTime,
        endDateTime: consultation.endDateTime,

        psychologist: {
            id: psychologist.id,
            name: psychologist.name,
            profileImage: psychologist.profileImage,
        },
        patient: {
            id: user.id,
            name: user.name,
            profileImage: user.profileImage,
        },
        slot: {
            id: slot.id,
            startDateTime: slot.startDateTime,
            endDateTime: slot.endDateTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy,
        },
        payment: {
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            paymentStatus: payment.paymentStatus,
            refunded: payment.refunded,
        },
        video: {
            duration: video.duration,
            startedAt: video.startedAt,
            endedAt: video.endedAt,
        },
    };
}

export function toConsultationDtoForAdmin(data: {
    consultation: Consultation;
    patient: User;
    psychologist: Psychologist & User;
    payment?: Payment;
}): IConsultationDetailsForAdminDto {
    return {
        id: data.consultation.id,
        patientName: data.patient.name,
        patientProfileImage: data.patient.profileImage,
        psychologistName: data.psychologist.name,
        psychologistProfileImage: data.psychologist.profileImage,
        startDateTime: data.consultation.startDateTime,
        endDateTime: data.consultation.endDateTime,
        sessionGoal: data.consultation.sessionGoal,
        status: data.consultation.status,
        paymentStatus: data.payment?.paymentStatus,
        paymentMethod: data.payment?.paymentMethod,
    };
}
