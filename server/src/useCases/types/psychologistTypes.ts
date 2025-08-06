// Input and Output types for Profile Use Cases
import { Kyc } from "../../domain/entities/kyc";
import { Psychologist } from "../../domain/entities/psychologist";
import {Weekday} from 'rrule'

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
    identificationDoc: string;
    educationalCertification: string;
    experienceCertificate: string;
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
    profileImage?: string;
    aboutMe?: string;
    defaultFee?: number;
}

export interface IRecurringSlotInput {
    psychologistId: string;
    fromDate: string;
    toDate: string;
    weekDays: Weekday[];
    startTime: string;
    endTime: string;
    duration: number;
    timeZone: string;
}