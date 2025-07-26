import type { IGetAllPsychologistRequest, IGetAllPsychologistResponse } from "../../types/api/user";
import type { IUserDto } from "../../types/user";
import { server } from "../server";

export const userApi = {
    getAllPsychologists: async(params?: IGetAllPsychologistRequest) => server.get<IGetAllPsychologistResponse>("/user/psychologists", {params}) ,
    getProfile: async(): Promise<IUserDto> => server.get("/user/profile"),
    updateProfile: async(data: FormData): Promise<IUserDto> => server.put("user/profile", data, {
        headers: { "Content-Type" : "multipart/form-data" }
    }),
}