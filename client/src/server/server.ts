import instance from "../lib/axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export const server = {
    get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => instance.get<T>(url, config).then(res => res.data),
    post: <T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => instance.post<T, AxiosResponse<T>, D>(url, data, config).then((res) => res.data),
    put: <T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => instance.put<T, AxiosResponse<T>, D>(url, data, config).then((res) => res.data),
    delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => instance.delete<T>(url, config).then((res) => res.data),
}