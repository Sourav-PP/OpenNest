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
  }
];