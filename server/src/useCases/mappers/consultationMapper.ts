import { IConsultationDto, IPsychologistChatConsultationDto, IPsychologistConsultationDto, IUserChatConsultationDto } from '../dtos/consultation';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';
import { Consultation } from '@/domain/entities/consultation';
import { Message } from '@/domain/entities/message';

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
        patientId: consultation.patientId,        
        psychologist: {
            id: psychologist.id,
            name: user.name, 
            profileImage: user.profileImage,
        },
        lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            receiverId: lastMessage.receiverId,
        } : undefined,
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
        psychologistId: consultation.psychologistId,
        patient: {
            id: patient.id,
            name: patient.name, 
            profileImage: patient.profileImage,
        },
        lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            receiverId: lastMessage.receiverId,
        } : undefined,
        lastMessageTime,
        unreadCount,
    };
}

