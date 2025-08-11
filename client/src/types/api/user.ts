import type { IPsychologistDto } from "../pasychologist";

export interface IGetAllPsychologistResponse {
    psychologists: IPsychologistDto[];
    totalCount?: number
}

export interface IGetAllPsychologistRequest {
    search?: string;
    specialization?: string;
    sort?: "asc" | "desc";
    gender?: "Male" | "Female";
    page?: number;
    limit?: number
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