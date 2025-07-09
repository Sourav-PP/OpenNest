import axios from "axios";

const instance = axios.create({
    baseURL: "http://192.168.20.2:5006/api",
    withCredentials: true
})

export class ApiClient {
    private client = instance

    constructor() {
        this.client.interceptors.response.use(
            (response) => response,
            async(error) => {
                const originalRequest = error.config
                if(error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/refresh-token") {
                    originalRequest._retry = true
                    try {
                        const { data } = await this.client.post("/auth/refresh-token");
                        localStorage.setItem("accessToken", data.accessToken);
                        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        localStorage.removeItem("accessToken");
                        window.location.href = "/login";
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        )
    }
    getInstance() {
        return this.client; 
    }

    setAuthToken(token: string) {
        this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

export const apiClient = new ApiClient();