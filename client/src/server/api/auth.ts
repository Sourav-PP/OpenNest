import { server } from "../server";
import type {
  ISignupResponse,
  ILoginRequest,
  ILoginResponse,
  ISendOtpRequest,
  IVerifyOtpRequest,
  IGoogleLoginInput,
  IGoogleLoginResponse,
} from "../../types/api/auth";

export const authApi = {
  login: async (data: ILoginRequest) =>
    server.post<ILoginResponse, ILoginRequest>("/auth/login", data),
  googleLogin: async (data: IGoogleLoginInput) =>
    server.post<IGoogleLoginResponse, IGoogleLoginInput>('/auth/google-login', data),
  logout: async () => server.post<void, undefined>("/auth/logout", undefined),
  signup: async (data: FormData) =>
    server.post<ISignupResponse, FormData>("/auth/signup", data),
  sendOtp: async (data: ISendOtpRequest) =>
    server.post<void, ISendOtpRequest>("/auth/send-otp", data),
  verifyOtp: async (data: IVerifyOtpRequest) =>
    server.post<void, IVerifyOtpRequest>("/auth/verify-otp", data),
};
