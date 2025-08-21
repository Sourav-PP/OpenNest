import PublicRoute from '@/components/auth/PublicRoute';
import type { RouteObject } from 'react-router-dom';

import LandingPage from '@/features/user/pages/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import AdminLoginPage from '@/features/admin/pages/AdminLoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import ForgotPasswordPage from '@/features/user/pages/ForgotPasswordPage';
import VerifyForgotPasswordOtpPage from '@/features/auth/pages/VerifyForgotPasswordOtpPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import LogoutPage from '@/features/user/pages/LogoutPage';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/logout',
    element: <LogoutPage/>
  },
  {
    path: '/signup',
    element: <PublicRoute><SignupPage /></PublicRoute >
  },
  {
    path: '/login',
    element: <PublicRoute><LoginPage /></PublicRoute>
  },
  {
    path: '/admin/login',
    element: <PublicRoute>< AdminLoginPage /></PublicRoute>
  },
  {
    path: '/forgot-password',
    element: <PublicRoute>< ForgotPasswordPage /></PublicRoute>
  },
  {
    path: '/verify-otp',
    element: <PublicRoute>< VerifyForgotPasswordOtpPage /></PublicRoute>
  },
  {
    path: '/reset-password',
    element: <PublicRoute>< ResetPasswordPage /></PublicRoute>
  }
];