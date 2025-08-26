import { IConsultationDto, IPsychologistConsultationDto } from '../dtos/consultation';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';
import { Consultation } from '@/domain/entities/consultation';

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

