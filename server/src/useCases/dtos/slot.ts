export interface ISlotDto {
    id?: string;
    psychologistId: string;
    startDateTime: Date;
    endDateTime: Date;
    isBooked?: boolean;
    bookedBy?: {
        name: string;
    } | null;
}

export interface ICreateSlotDto {
    psychologistId: string;
    startDateTime: Date;
    endDateTime: Date;
}