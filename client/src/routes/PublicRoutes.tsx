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
import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';

export const publicRoutes: RouteObject[] = [
  {
    path: publicFrontendRoutes.landing,
    element: <LandingPage />,
  },
  {
    path: publicFrontendRoutes.logout,
    element: <LogoutPage />,
  },
  {
    path: publicFrontendRoutes.signup,
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: publicFrontendRoutes.login,
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: publicFrontendRoutes.adminLogin,
    element: (
      <PublicRoute>
        <AdminLoginPage />
      </PublicRoute>
    ),
  },
  {
    path: publicFrontendRoutes.forgotPassword,
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: publicFrontendRoutes.verifyOtp,
    element: (
      <PublicRoute>
        <VerifyForgotPasswordOtpPage />
      </PublicRoute>
    ),
  },
  {
    path: publicFrontendRoutes.resetPassword,
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
];
