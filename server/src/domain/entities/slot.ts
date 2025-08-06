export interface Slot {
    id?: string;
    psychologistId: string;
    startDateTime: Date;
    endDateTime: Date;
    isBooked?: boolean;
    bookedBy?: string | null;
}