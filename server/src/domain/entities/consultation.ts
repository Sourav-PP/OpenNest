export interface Consultation {
    id: string;
    patientId: string;
    psychologistId: string;
    subscriptionId?: string;
    slotId: string;
    startDateTime: Date;
    endDateTime: Date;
    sessionGoal: string;
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled';
    paymentStatus: 'pending' | 'paid' | 'failed'
    paymentMethod: 'stripe' | 'wallet' | null
    paymentIntentId: string | null
    cancellationReason?: string;
    cancelledAt?: Date;
    includedInPayout: boolean;
    meetingLink?: string;
}