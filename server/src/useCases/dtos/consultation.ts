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
    }
}

export interface IPsychologistConsultationDto {
    id?: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    meetingLink?: string;
    psychologistId: string
    patient: {
        id: string;
        name: string;
        profileImage?: string;
    };
}