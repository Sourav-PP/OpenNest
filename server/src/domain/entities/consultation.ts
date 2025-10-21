import { ConsultationPaymentStatus, ConsultationStatus, ConsultationPaymentMethod } from '../enums/ConsultationEnums';

export interface ConsultationNotes {
    privateNotes?: string;
    feedback?: string;
    updatedAt?: Date;
}

export interface Consultation {
    id: string;
    patientId: string;
    psychologistId: string;
    subscriptionId?: string;
    slotId: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: ConsultationStatus;
    paymentStatus: ConsultationPaymentStatus
    paymentMethod: ConsultationPaymentMethod
    paymentIntentId: string | null;
    notes?: ConsultationNotes;
    cancellationReason?: string;
    cancelledAt?: Date;
    includedInPayout: boolean;
    meetingLink?: string;
    createdAt?: Date;
}
