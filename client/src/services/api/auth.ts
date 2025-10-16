import { server } from '../server';

import type {
  ISignupResponse,
  ILoginRequest,
  ILoginResponse,
  ISendOtpRequest,
  IVerifyOtpRequest,
  IGoogleLoginInput,
  IPreSignupResponse,
  IVerifyOtpResponse,
  IVerifyForgotOtpRequest,
  IResetPasswordRequest,
} from '../../types/api/auth';
import type { BackendResponse } from '@/types/api/api';

export const authApi = {
  login: async (data: ILoginRequest) => server.post<ILoginResponse, ILoginRequest>('/auth/login', data),
  googleLogin: async (data: IGoogleLoginInput) =>
    server.post<ILoginResponse, IGoogleLoginInput>('/auth/google-login', data),
  logout: async () => server.post<BackendResponse, undefined>('/auth/logout', undefined),
  preSignup: async (data: FormData) => server.post<IPreSignupResponse, FormData>('/auth/signup', data),
  signup: async (data: FormData) => server.post<ISignupResponse, FormData>('/auth/signup', data),
  sendOtp: async (data: ISendOtpRequest) => server.post<BackendResponse, ISendOtpRequest>('/auth/send-otp', data),
  verifyOtp: async (data: IVerifyOtpRequest) =>
    server.post<IVerifyOtpResponse, IVerifyOtpRequest>('/auth/verify-otp', data),
  verifyForgotOtp: async (data: IVerifyForgotOtpRequest) =>
    server.post<BackendResponse, IVerifyForgotOtpRequest>('/auth/forgot/verify-otp', data),
  resetPassword: async (data: IResetPasswordRequest) =>
    server.post<BackendResponse, IResetPasswordRequest>('/auth/forgot/reset-password', data),
};
