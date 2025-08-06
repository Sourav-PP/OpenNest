import { server } from "../server";
import type { IPsychologistProfileDto } from "../../types/pasychologist";
import type { IRecurringSlotInput, ISingleSlotInput } from "../../types/api/slot";

export const psychologistApi = {
    getProfile: async() => server.get<IPsychologistProfileDto>("/psychologist/profile"),
    submitVerification: async(data: FormData ) => server.post("/auth/psychologist/verify-profile", data),
    updatePsychologistProfile: async(data: FormData) => server.put<IPsychologistProfileDto, FormData>('/psychologist/profile', data, {
        headers: { "Content-Type" : "multipart/form-data" }
    }),
    createSingleSlot: async(data: ISingleSlotInput) => server.post('/psychologist/slot', data),
    createRecurringSlot: async(data: IRecurringSlotInput) => server.post('/psychologist/slot', data)
}