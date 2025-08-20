import PrivateRoute from '@/components/auth/PrivateRoute';
import type { RouteObject } from 'react-router-dom';

import TherapistPage from '@/pages/user/TherapistPage';
import UserProfilePage from '@/pages/user/UserProfilePage';
import ChangePasswordPage from '@/pages/user/ChangePasswordPage';
import PsychologistDetailPage from '@/pages/user/PsychologistDetailPage';
import UserServicePage from '@/pages/user/UserServicePage';
import Success from '@/components/user/Success';
import Cancel from '@/components/user/Cancel';
import MySessionsPage from '@/pages/user/MySessionsPage';

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