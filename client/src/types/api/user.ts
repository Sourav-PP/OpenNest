import type { IConsultationDto } from "../consultation";
import type { IPsychologistDto } from "../pasychologist";

export interface IGetAllPsychologistResponse {
    psychologists: IPsychologistDto[];
    totalCount?: number
}

export interface IGetAllPsychologistRequest {
    search?: string;
    specialization?: string;
    sort?: "asc" | "desc";
    gender: "Male" | "Female" | 'all';
    page?: number;
    limit?: number,
    expertise?: string
}

export interface ICreateCheckoutSessionInput {
    subscriptionId?: string;
    slotId: string;
    amount: number;
    sessionGoal: string;
}

export interface ICreateCheckoutSessionResponse {
    url: string
}

export interface IGetUserConsultationsRequest {
    search?: string;
    sort?: 'asc' | 'desc';
    status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all';
    page?: number;
    limit?: number;
}

export interface IGetUserConsultationsResponse {
    consultations: IConsultationDto[],
    totalCount: number
}