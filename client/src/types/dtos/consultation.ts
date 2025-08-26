export interface IConsultationDto {
    id: string;
    patientId: string;
    startDateTime: string;
    endDateTime: string;
    sessionGoal: string;
    status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    meetingLink?: string;
    psychologist: {
        id: string;
        name: string;
        profileImage: string;
    }
}

export interface IPsychologistConsultationDto {
    id: string;
    patientId: string;
    startDateTime: string;
    endDateTime: string;
    sessionGoal: string;
    status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    meetingLink?: string;
    patient: {
        id: string;
        name: string;
        profileImage: string;
    }
}
