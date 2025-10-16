import type { UserRoleType } from '@/constants/User';
import type { BackendResponse } from './api';

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponseData {
  user: {
    name: string;
    email: string;
    role: UserRoleType;
    profileImage: string;
  };
  accessToken: string;
  hasSubmittedVerificationForm: boolean;
}

export interface IGoogleLoginInput {
  credential: string;
  role: UserRoleType;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IGoogleLoginResponse {
  user: {
    name: string;
    email: string;
    role: UserRoleType;
    profileImage?: string;
  };
  accessToken: string;
  hasSubmittedVerificationForm: boolean;
}

export interface IPreSignupResponseData {
  signupToken: string;
}

export interface ISignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRoleType;
}

export interface ISignupResponse {
  user: {
    name: string;
    email: string;
    role: UserRoleType;
  };
  accessToken: string;
}

export interface ISendOtpRequest {
  email: string;
}

export interface IVerifyOtpRequest {
  email: string;
  otp: string;
  signupToken: string;
}

export interface IVerifyOtpResponse {
  user: {
    name: string;
    email: string;
    role: UserRoleType;
  };
  accessToken: string;
}

export interface IVerifyForgotOtpRequest {
  email: string;
  otp: string;
}

export interface IResetPasswordRequest {
  email: string;
  password: string;
}

export type ILoginResponse = BackendResponse<ILoginResponseData>;
export type IPreSignupResponse = BackendResponse<IPreSignupResponseData>;
