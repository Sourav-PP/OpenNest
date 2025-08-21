import PrivateRoute from '@/components/auth/PrivateRoute';
import type { RouteObject } from 'react-router-dom';

import VerificationPage from '@/features/psychologist/pages/VerificationPage';
import ProfilePage from '@/features/psychologist/pages/ProfilePage';
import EditProfilePage from '@/features/psychologist/pages/EditProfilePage';
import CreateSlotPage from '@/features/psychologist/pages/CreateSlotPage';
import MyKycDetailsPage from '@/features/psychologist/pages/MyKycDetailsPage';
import ChangePsychologistPasswordPage from '@/features/psychologist/pages/ChangePsychologistPasswordPage';

export const psychologistRoutes: RouteObject[] = [
  {
    path: '/psychologist/verification',
    element: <PrivateRoute allowedRoles={['psychologist']}>< VerificationPage/></PrivateRoute>
  },
  {
    path: '/psychologist/profile',
    element: <PrivateRoute allowedRoles={['psychologist']}>< ProfilePage /></PrivateRoute>
  },
  {
    path: '/psychologist/edit-profile',
    element: <PrivateRoute allowedRoles={['psychologist']}>< EditProfilePage /></PrivateRoute>
  },
  {
    path: '/psychologist/change-password',
    element:  <PrivateRoute allowedRoles={['psychologist']}>< ChangePsychologistPasswordPage /></PrivateRoute>
  },
  {
    path: '/psychologist/kyc',
    element: <PrivateRoute allowedRoles={['psychologist']}>< MyKycDetailsPage /></PrivateRoute>
  },
  {
    path:'/psychologist/slot',
    element: <PrivateRoute allowedRoles={['psychologist']}><CreateSlotPage/></PrivateRoute>
  }
];