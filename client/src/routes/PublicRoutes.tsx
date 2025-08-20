import PublicRoute from '@/components/auth/PublicRoute';
import type { RouteObject } from 'react-router-dom';

import LandingPage from '@/pages/user/LandingPage';
import LoginPage from '@/pages/user/LoginPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import SignupPage from '@/pages/user/SignupPage';
import ForgotPasswordPage from '@/pages/user/ForgotPasswordPage';
import VerifyForgotPasswordOtpPage from '@/pages/user/VerifyForgotPasswordOtpPage';
import ResetPasswordPage from '@/pages/user/ResetPasswordPage';
import LogoutPage from '@/pages/user/LogoutPage';

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