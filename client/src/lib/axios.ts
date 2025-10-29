import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { store } from '../redux/store';
import { loginSuccess, logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { navigateTo } from './utils/navigation';
import { HttpStatus } from './constants/httpStatus';
import { jwtDecode } from 'jwt-decode';
import { UserRole, type UserRoleType } from '@/constants/types/User';
import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';
import { generalMessages } from '@/messages/GeneralMessages';
import { authRoutes } from '@/constants/apiRoutes/authRoutes';
import { adminRoutes } from '@/constants/apiRoutes/adminRoutes';
import { logger } from './utils/logger';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let baseURL = import.meta.env.VITE_API_BASE_URL;

if (window.location.hostname.includes('devtunnels.ms')) {
  baseURL = import.meta.env.DEV_TUNNEL_URL;
}

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

// attach access token if available
instance.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// response interceptor
instance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // blocked account (403)
    if (error.response?.status === HttpStatus.FORBIDDEN) {
      toast.error(generalMessages.ERROR.BLOCKED_USER);
      const role = store.getState().auth.role;
      store.dispatch(logout());

      const loginRedirect =
        role === UserRole.PSYCHOLOGIST
          ? publicFrontendRoutes.login
          : role === UserRole.ADMIN
            ? publicFrontendRoutes.adminLogin
            : publicFrontendRoutes.login;

      setTimeout(() => {
        navigateTo(loginRedirect, { role });
      }, 1800);
      return Promise.reject(error);
    }

    // unauthorized (401)
    if (
      error.response?.status === HttpStatus.UNAUTHORIZED &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh-token') &&
      ![
        authRoutes.login,
        authRoutes.signup,
        authRoutes.sendOtp,
        authRoutes.verifyOtp,
        adminRoutes.login,
        adminRoutes.refreshToken,
      ].some(path => originalRequest.url?.includes(path))
    ) {
      originalRequest._retry = true;

      const { role } = store.getState().auth;

      // Role-based refresh endpoint
      const refreshEndpoint = role === UserRole.ADMIN ? adminRoutes.refreshToken : authRoutes.refreshToken;

      try {
        const { data } = await instance.post(refreshEndpoint);
        const accessToken = data.accessToken.accessToken;

        const decoded: { email: string; userId: string; role: UserRoleType } = jwtDecode(accessToken);

        store.dispatch(
          loginSuccess({
            accessToken,
            email: decoded.email,
            userId: decoded.userId,
            role: decoded.role,
          })
        );

        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (err) {
        store.dispatch(logout());

        const loginRedirect =
          role === UserRole.ADMIN
            ? publicFrontendRoutes.adminLogin
            : role === UserRole.PSYCHOLOGIST
              ? publicFrontendRoutes.login
              : publicFrontendRoutes.login;

        navigateTo(loginRedirect, { role });
        return Promise.reject(err);
      }
    }

    // 🔹 404 handling
    if (error.response?.status === HttpStatus.NOT_FOUND) {
      const message = (error.response.data as any)?.message;
      if (message === 'Route not found') {
        logger.error('[API] 404 Route not found', error.response);
        navigateTo('/system-error');    
        return Promise.reject(error); 
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
