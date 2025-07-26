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