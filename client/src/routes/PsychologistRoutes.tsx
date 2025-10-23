import PrivateRoute from '@/components/auth/PrivateRoute';
import type { RouteObject } from 'react-router-dom';

import VerificationPage from '@/features/psychologist/pages/VerificationPage';
import ProfilePage from '@/features/psychologist/pages/ProfilePage';
import EditProfilePage from '@/features/psychologist/pages/EditProfilePage';
import CreateSlotPage from '@/features/psychologist/pages/CreateSlotPage';
import MyKycDetailsPage from '@/features/psychologist/pages/MyKycDetailsPage';
import ChangePsychologistPasswordPage from '@/features/psychologist/pages/ChangePsychologistPasswordPage';
import PsychologistChatPage from '@/features/chat/pages/PsychologistChatPage';
import MySessionsPage from '@/features/psychologist/pages/MySessionsPage';
import ConsultationDetailPage from '@/features/psychologist/pages/ConsultationDetailPage';
import VideoCallPage from '@/features/videoCall/pages/VideoCallPage';
import PsychologistConsultationHistoryPage from '@/features/psychologist/pages/PsychologistConsultationHistoryPage';
import PsychologistConsultationHistoryDetailPage from '@/features/psychologist/pages/PsychologistConsultationHistoryDetailPage';
import PatientHistoryPage from '@/features/psychologist/pages/PatientHistoryPage';
import PsychologistDashboard from '@/features/psychologist/pages/PsychologistDashboard';
import { psychologistFrontendRoutes } from '@/constants/frontendRoutes/psychologistFrontendRoutes';
import { UserRole } from '@/constants/types/User';
import PsychologistReviewsPage from '@/features/psychologist/pages/PsychologistReviewsPage';

export const psychologistRoutes: RouteObject[] = [
  {
    path: psychologistFrontendRoutes.verification,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <VerificationPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.profile,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.editProfile,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <EditProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.changePassword,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <ChangePsychologistPasswordPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.kyc,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <MyKycDetailsPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.slot,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <CreateSlotPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.consultations,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <MySessionsPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.consultationDetailPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <ConsultationDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.chat,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <PsychologistChatPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.chatWithConsultationPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <PsychologistChatPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.videoCallPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <VideoCallPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.consultationHistory,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <PsychologistConsultationHistoryPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.consultationHistoryDetailPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <PsychologistConsultationHistoryDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.patientHistoryPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <PatientHistoryPage />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.dashboard,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <PsychologistDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: psychologistFrontendRoutes.reviews,
    element: (
      <PrivateRoute allowedRoles={[UserRole.PSYCHOLOGIST]}>
        <PsychologistReviewsPage />
      </PrivateRoute>
    ),
  },
];
