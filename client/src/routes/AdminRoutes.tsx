import PrivateRoute from '@/components/auth/PrivateRoute';
import type { RouteObject } from 'react-router-dom';

import AdminDashboard from '@/pages/admin/Dashboard';
import UserManagement from '@/pages/admin/UserManagement';
import PsychologistManagement from '@/pages/admin/PsychologistManagement';
import ServicePage from '@/pages/admin/ServicePage';
import KycManagement from '@/pages/admin/KycManagement';
import KycVerificationPage from '@/pages/admin/KycVerificationPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin/dashboard',
    element: <PrivateRoute allowedRoles={['admin']}>< AdminDashboard /></PrivateRoute>
  },
  {
    path: '/admin/users',
    element: <PrivateRoute allowedRoles={['admin']}><UserManagement /></PrivateRoute>
  },
  {
    path: '/admin/psychologists',
    element: <PrivateRoute allowedRoles={['admin']}><PsychologistManagement /></PrivateRoute>
  },
  {
    path: '/admin/kyc',
    element: <PrivateRoute allowedRoles={['admin']}><KycManagement /></PrivateRoute>
  },
  {
    path: '/admin/kyc/:psychologistId',
    element: <PrivateRoute allowedRoles={['admin']}><KycVerificationPage /></PrivateRoute>
  },
  {
    path: '/admin/services',
    element: <PrivateRoute allowedRoles={['admin']}><ServicePage /></PrivateRoute>
  }
];