export interface IConsultationBookingInput {
    slotId: string;
    patientId: string;
    psychologistId: string;
    sessionGoal: string;
    issue: string[];
}
