import PrivateRoute from '@/components/auth/PrivateRoute';
import type { RouteObject } from 'react-router-dom';

import AdminDashboard from '@/features/admin/pages/Dashboard';
import UserManagement from '@/features/admin/pages/UserManagement';
import PsychologistManagement from '@/features/admin/pages/PsychologistManagement';
import ServicePage from '@/features/admin/pages/ServicePage';
import KycManagement from '@/features/admin/pages/KycManagement';
import KycVerificationPage from '@/features/admin/pages/KycVerificationPage';



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