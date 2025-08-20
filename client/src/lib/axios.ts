import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { store } from '../redux/store';
import { loginSuccess, logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { navigateTo } from './utils/navigation';
import { HttpStatus } from './constants/httpStatus';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

    // blocked account
    if (error.response?.status === HttpStatus.FORBIDDEN) {
      toast.error('Your account has been blocked. Please contact support.');
      const role = store.getState().auth.role;
      store.dispatch(logout());

      const loginRedirect =
        role === 'psychologist' ? '/login' : role === 'admin' ? '/admin/login' : '/login';

      setTimeout(() => {
        navigateTo(loginRedirect, { role });
      }, 1800);
      return Promise.reject(error);
    }

    if (
      error.response?.status === HttpStatus.UNAUTHORIZED &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh-token') &&
      ![
        '/auth/login',
        '/auth/signup',
        '/auth/send-otp',
        '/auth/verify-otp',
        '/admin/login',
        '/admin/refresh-token',
      ].some(path => originalRequest.url?.includes(path))
    ) {
      originalRequest._retry = true;

      const { role, email, userId } = store.getState().auth;

      // Role-based refresh endpoint
      const refreshEndpoint = role === 'admin' ? '/admin/refresh-token' : '/auth/refresh-token';

      try {
        const { data } = await instance.post(refreshEndpoint);
        const accessToken = data.accessToken.accessToken;

        store.dispatch(
          loginSuccess({
            accessToken,
            email: email ?? '',
            userId: userId ?? '',
            role: role ?? 'user',
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
          role === 'admin'
            ? '/admin/login'
            : role === 'psychologist'
              ? '/login'
              : '/login';

        navigateTo(loginRedirect, { role });
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
