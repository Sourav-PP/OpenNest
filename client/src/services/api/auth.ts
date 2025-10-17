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
import { authRoutes } from '@/constants/apiRoutes/authRoutes';

export const authApi = {
  login: async (data: ILoginRequest) => server.post<ILoginResponse, ILoginRequest>(authRoutes.login, data),
  googleLogin: async (data: IGoogleLoginInput) =>
    server.post<ILoginResponse, IGoogleLoginInput>(authRoutes.googleLogin, data),
  logout: async () => server.post<BackendResponse, undefined>(authRoutes.logout, undefined),
  preSignup: async (data: FormData) => server.post<IPreSignupResponse, FormData>(authRoutes.preSignup, data),
  signup: async (data: FormData) => server.post<ISignupResponse, FormData>(authRoutes.signup, data),
  sendOtp: async (data: ISendOtpRequest) => server.post<BackendResponse, ISendOtpRequest>(authRoutes.sendOtp, data),
  verifyOtp: async (data: IVerifyOtpRequest) =>
    server.post<IVerifyOtpResponse, IVerifyOtpRequest>(authRoutes.verifyOtp, data),
  verifyForgotOtp: async (data: IVerifyForgotOtpRequest) =>
    server.post<BackendResponse, IVerifyForgotOtpRequest>(authRoutes.verifyForgotOtp, data),
  resetPassword: async (data: IResetPasswordRequest) =>
    server.post<BackendResponse, IResetPasswordRequest>(authRoutes.resetPassword, data),
};
