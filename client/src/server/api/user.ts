import type { ISlotDto } from "@/types/slot";
import type {
    IGetUserConsultationsResponse,
    ICreateCheckoutSessionInput,
    ICreateCheckoutSessionResponse,
    IGetAllPsychologistRequest,
    IGetAllPsychologistResponse,
    IGetUserConsultationsRequest
} from "../../types/api/user";
import type { IPsychologistProfileDto } from "../../types/pasychologist";
import type { IUserDto } from "../../types/user";
import { server } from "../server";

export const userApi = {
    getAllPsychologists: async(params?: IGetAllPsychologistRequest) => server.get<IGetAllPsychologistResponse>("/user/psychologists", {params}) ,
    getPsychologistById: async(id: string) => server.get<IPsychologistProfileDto>(`/user/psychologists/${id}`),
    getProfile: async(): Promise<IUserDto> => server.get("/user/profile"),
    updateProfile: async(data: FormData): Promise<IUserDto> => server.put("/user/profile", data, {
        headers: { "Content-Type" : "multipart/form-data" }
    }),
    getSlotsByPsychologist: async(userId: string, date: string) => server.get<ISlotDto[]>(`/user/psychologists/${userId}/slots`, {
        params: {date}
    }),
    createCheckoutSession: async(input: ICreateCheckoutSessionInput) => server.post<ICreateCheckoutSessionResponse, ICreateCheckoutSessionInput>('/user/payment/create-checkout-session', input),
    getUserConsultations: async(params?: IGetUserConsultationsRequest) => server.get<IGetUserConsultationsResponse>("/user/consultations", {params}),
}