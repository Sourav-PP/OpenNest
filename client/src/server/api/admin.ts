import type { IAdminLoginRequest, IAdminLoginResponse, IAddServiceResponse, IGetAllUserRequest, IGetAllUserResponse, IGetAllPsychologistResponse, IGetAllPsychologistsRequest, IToggleStatusRequest, IToggleStatusResponse } from "../../types/api/admin"

import { server } from "../server"

export const adminApi = {
    login: async(data: IAdminLoginRequest) => server.post<IAdminLoginResponse, IAdminLoginRequest>('/admin/login', data),
    logout: async() => server.post<void, undefined>('/admin/logout', undefined),
    addService: async(data: FormData) => server.post<IAddServiceResponse, FormData>("/admin/services", data),
    getAllUser: async(params?: IGetAllUserRequest) => server.get<IGetAllUserResponse>("/admin/users", {params}),
    getAllPsychologists: async(params?: IGetAllPsychologistsRequest) => server.get<IGetAllPsychologistResponse>("admin/psychologists", {params}),
    toggleUserStatus: async (userId: string, data: IToggleStatusRequest) =>server.patch<IToggleStatusResponse, IToggleStatusRequest>(`/admin/users/${userId}/status`, data),
}