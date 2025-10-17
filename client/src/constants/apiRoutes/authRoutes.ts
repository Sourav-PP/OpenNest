export const authRoutes = {
  login: '/auth/login',
  googleLogin: '/auth/google-login',
  logout: '/auth/logout',
  preSignup: '/auth/signup',
  signup: '/auth/signup',
  sendOtp: '/auth/send-otp',
  verifyOtp: '/auth/verify-otp',
  verifyForgotOtp: '/auth/forgot/verify-otp',
  resetPassword: '/auth/forgot/reset-password',
  changePassword: '/auth/change-password',
  refreshToken: '/auth/refresh-token'
} as const;
