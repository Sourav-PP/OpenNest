import { server } from "../server";
import type { ISignupResponse, ILoginRequest, ILoginResponse, ISignupRequest, ISendOtpRequest, IVerifyOtpRequest } from "../../types/api/auth";

export const authApi = {
    login: (data: ILoginRequest) => server.post<ILoginResponse, ILoginRequest>("/auth/login", data),
    logout: () => server.post<void, undefined>("/auth/logout", undefined),
    signup: (data: ISignupRequest) => server.post<ISignupResponse, ISignupRequest>("/auth/signup", data),
    sendOtp: (data: ISendOtpRequest)  => server.post<void, ISendOtpRequest>("/auth/send-otp", data),
    verifyOtp: (data: IVerifyOtpRequest) => server.post<void, IVerifyOtpRequest>("/auth/verify-otp", data)
}