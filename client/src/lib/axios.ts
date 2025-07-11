import axios, {AxiosError, type AxiosRequestConfig} from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}


const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type" : "application/json"
    }
})

type Role = "user" | "psychologist" | "admin"

instance.interceptors.request.use((config) => {
    console.log(import.meta.env.BASE_URL)
    const token = localStorage.getItem("accessToken")
    if(token) {
        config.headers["Authorization"] = `Bearer ${token}` 
    }
    return config
})

instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig

        if(
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/refresh-token") &&
            !["/auth/login", "/auth/signup", "/auth/send-otp", "/auth/verify-otp", "/admin/login", "/admin/refresh-token"].some((path) =>
                originalRequest.url?.includes(path)
            )
        ) {
            originalRequest._retry = true;

            const role = (localStorage.getItem("role") as Role) || "user";

            // Role-based refresh endpoint
            const refreshEndpoint = role === "admin" ? "/admin/refresh-token" : "/auth/refresh-token";

            try {
                const {data} = await instance.post(refreshEndpoint)
                const accessToken = data.accessToken

                localStorage.setItem('accessToken', accessToken)
                if (!originalRequest.headers) {
                    originalRequest.headers = {};
                }
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return instance(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");

                const loginRedirect = role === "admin" ? "/admin/login" : role === "psychologist" ? "/login?role=psychologist" : "/login?role=user";
            
                window.location.href = loginRedirect;
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
)

export default instance