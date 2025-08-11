export interface ISlotDto {
    id: string;
    psychologistId: string;
    startDateTime: string;
    endDateTime: string;
    isBooked: boolean;
    bookedBy?: {
        name?: string
    }
}