// Input and Output types for Profile Use Cases
import { Kyc } from '../../domain/entities/kyc';
import { Psychologist } from '../../domain/entities/psychologist';

export interface IVerifyProfileInput {
    userId: string;
    aboutMe: string;
    qualification: string;
    specializations: string[];
    defaultFee: number;
    isVerified: boolean;
    specializationFees: {
        specializationId: string;
        specializationName: string;
        fee: number;
    }[];
    files?: Record<string, Express.Multer.File[]>;
}

export interface IVerifyProfileOutput {
    psychologist: Psychologist,
    kyc: Kyc
}

export interface IUpdatePsychologistProfileInput {
    userId: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    file?: Express.Multer.File;
    aboutMe?: string;
    defaultFee?: number;
}

export interface IRecurringSlotInput {
    userId: string;
    fromDate: string;
    toDate: string;
    weekDays: string[];
    startTime: string;
    endTime: string;
    duration: number;
    timeZone: string;
}

export interface ISingleSlotInput {
    userId: string;
    startDateTime: Date;
    endDateTime: Date;
}
export interface IDeleteSlotInput {
    slotId: string;
    userId: string;
}