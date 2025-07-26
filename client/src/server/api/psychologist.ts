import { server } from "../server";
import type { IPsychologistProfileDto } from "../../types/pasychologist";

export const psychologistApi = {
    getProfile: async() => server.get<IPsychologistProfileDto>("/psychologist/profile"),
    submitVerification: async(data: FormData ) => server.post("/auth/psychologist/verify-profile", data)
}