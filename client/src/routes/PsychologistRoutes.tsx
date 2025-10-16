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

export const psychologistRoutes: RouteObject[] = [
  {
    path: '/psychologist/verification',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <VerificationPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/profile',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/edit-profile',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <EditProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/change-password',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <ChangePsychologistPasswordPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/kyc',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <MyKycDetailsPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/slot',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <CreateSlotPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/consultations',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <MySessionsPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/consultations/:id',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <ConsultationDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/chat',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <PsychologistChatPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/chat/:consultationId',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <PsychologistChatPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/consultations/:id/video',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <VideoCallPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/consultation/history',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <PsychologistConsultationHistoryPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/consultation/:consultationId/history',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <PsychologistConsultationHistoryDetailPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/patients/:patientId/history',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <PatientHistoryPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/psychologist/dashboard',
    element: (
      <PrivateRoute allowedRoles={['psychologist']}>
        <PsychologistDashboard />
      </PrivateRoute>
    ),
  },
];
