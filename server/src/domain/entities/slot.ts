export interface Slot {
    id: string;
    psychologistId: string;
    startDateTime: Date;
    endDateTime: Date;
    isAvailable: boolean;
    isBooked: boolean;
    bookedBy?: string | null;
}