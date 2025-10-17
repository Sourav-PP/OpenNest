import PrivateRoute from '@/components/auth/PrivateRoute';
import type { RouteObject } from 'react-router-dom';

import TherapistPage from '@/features/user/pages/TherapistPage';
import UserProfilePage from '@/features/user/pages/UserProfilePage';
import ChangePasswordPage from '@/features/user/pages/ChangePasswordPage';
import PsychologistDetailPage from '@/features/user/pages/PsychologistDetailPage';
import UserServicePage from '@/features/user/pages/UserServicePage';
import Success from '@/features/user/components/Success';
import Cancel from '@/features/user/components/Cancel';
import MySessionsPage from '@/features/user/pages/MySessionsPage';
import UserChatPage from '@/features/chat/pages/UserChatPage';
import WalletPage from '@/features/wallet/pages/WalletPage';
import ConsultationDetailPage from '@/features/user/pages/ConsultationDetailPage';
import VideoCallPage from '@/features/videoCall/pages/VideoCallPage';
import UserConsultationHistoryPage from '@/features/user/pages/UserConsultationHistoryPage';
import UserConsultationHistoryDetailPage from '@/features/user/pages/UserConsultationHistoryDetailPage';
import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';
import { UserRole } from '@/constants/types/User';

export const userRoutes: RouteObject[] = [
  {
    path: userFrontendRoutes.psychologist,
    element: <TherapistPage />,
  },
  {
    path: userFrontendRoutes.psychologistDetailPath,
    element: <PsychologistDetailPage />,
  },
  {
    path: userFrontendRoutes.services,
    element: <UserServicePage />,
  },
  {
    path: userFrontendRoutes.success,
    element: <Success />,
  },
  {
    path: userFrontendRoutes.cancel,
    element: <Cancel />,
  },
  {
    path: userFrontendRoutes.profile,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <UserProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.changePassword,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <ChangePasswordPage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.consultations,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <MySessionsPage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.consultationDetailPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <ConsultationDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.chat,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <UserChatPage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.chatByConsultationPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <UserChatPage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.wallet,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <WalletPage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.videoCallPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <VideoCallPage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.consultationHistory,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <UserConsultationHistoryPage />
      </PrivateRoute>
    ),
  },
  {
    path: userFrontendRoutes.consultationHistoryDetailPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <UserConsultationHistoryDetailPage />
      </PrivateRoute>
    ),
  },
];
