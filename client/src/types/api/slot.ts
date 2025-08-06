export interface ISingleSlotInput {
    startDateTime: string;
    endDateTime: string;
}

export interface IRecurringSlotInput {
    fromDate: string;
    toDate: string;
    weekDays: string[]
    startTime: string;
    endTime: string;
    duration: number;  
    timeZone: string;      
}