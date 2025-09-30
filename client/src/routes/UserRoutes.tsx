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

export const userRoutes: RouteObject[] = [
  {
    path: '/user/therapist',
    element: <TherapistPage />,
  },
  {
    path: '/user/psychologists/:id',
    element: <PsychologistDetailPage />
  },
  {
    path: '/user/services',
    element: <UserServicePage />   
  },
  {
    path: '/user/success',
    element: <Success />
  },
  {
    path:'/user/cancel',
    element: <Cancel />
  },
  {
    path: '/user/profile',
    element: <PrivateRoute allowedRoles={['user']}><UserProfilePage /></PrivateRoute>
  },
  {
    path: '/user/change-password',
    element: <PrivateRoute allowedRoles={['user']}><ChangePasswordPage /></PrivateRoute>
  },
  {
    path: '/user/consultations',
    element: <PrivateRoute allowedRoles={['user']}><MySessionsPage /></PrivateRoute>
  },
  {
    path: '/user/consultations/:id',
    element: <PrivateRoute allowedRoles={['user']}><ConsultationDetailPage /></PrivateRoute>
  },
  {
    path: '/user/chat',
    element: <PrivateRoute allowedRoles={['user']}><UserChatPage/></PrivateRoute>
  },
  {
    path: '/user/chat/:consultationId',
    element: <PrivateRoute allowedRoles={['user']}><UserChatPage/></PrivateRoute>
  },
  {
    path: '/user/wallet',
    element: <PrivateRoute allowedRoles={['user']}><WalletPage/></PrivateRoute>
  },
  {
    path: '/user/consultations/:id/video',
    element: <PrivateRoute allowedRoles={['user']}><VideoCallPage/></PrivateRoute>
  },
  {
    path: '/user/consultation/history',
    element: <PrivateRoute allowedRoles={['user']}><UserConsultationHistoryPage/></PrivateRoute>
  },
  {
    path: '/user/consultation/:consultationId/history',
    element: <PrivateRoute allowedRoles={['user']}><UserConsultationHistoryDetailPage/></PrivateRoute>
  },
];