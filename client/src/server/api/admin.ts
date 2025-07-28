import type { IAdminLoginRequest, IAdminLoginResponse, IAddServiceResponse, IGetAllUserRequest, IGetAllUserResponse } from "../../types/api/admin"
import { server } from "../server"

export const adminApi = {
    login: async(data: IAdminLoginRequest) => server.post<IAdminLoginResponse, IAdminLoginRequest>('/admin/login', data),
    logout: async() => server.post<void, undefined>('/admin/logout', undefined),
    addService: async(data: FormData) => server.post<IAddServiceResponse, FormData>("/admin/services", data),
    getAllUser: async(params?: IGetAllUserRequest) => server.get<IGetAllUserResponse>("/admin/users", {params})
}