import PrivateRoute from '@/components/auth/PrivateRoute';
import type { RouteObject } from 'react-router-dom';

import VerificationPage from '@/pages/psychologist/VerificationPage';
import ProfilePage from '@/pages/psychologist/ProfilePage';
import EditProfilePage from '@/pages/psychologist/EditProfilePage';
import CreateSlotPage from '@/pages/psychologist/CreateSlotPage';
import MyKycDetailsPage from '@/pages/psychologist/MyKycDetailsPage';
import ChangePsychologistPasswordPage from '@/pages/psychologist/ChangePsychologistPasswordPage';

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