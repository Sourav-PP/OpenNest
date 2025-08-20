export interface ISlotDto {
    id: string;
    psychologistId: string;
    startDateTime: string;
    endDateTime: string;
    isBooked: boolean;
    isExpired?: boolean;
    bookedBy?: {
        name?: string
    }
}