import PrivateRoute from '@/components/auth/PrivateRoute';
import type { RouteObject } from 'react-router-dom';

import AdminDashboard from '@/features/admin/pages/Dashboard';
import UserManagement from '@/features/admin/pages/UserManagement';
import PsychologistManagement from '@/features/admin/pages/PsychologistManagement';
import ServicePage from '@/features/admin/pages/ServicePage';
import KycManagement from '@/features/admin/pages/KycManagement';
import KycVerificationPage from '@/features/admin/pages/KycVerificationPage';
import ConsultationManagement from '@/features/admin/pages/ConsultationManagement';
import PlanPage from '@/features/admin/pages/PlanPage';
import PendingPayoutPage from '@/features/admin/pages/PendingPayoutPage';
import PayoutHistoryPage from '@/features/admin/pages/PayoutHistoryPage';
import { adminFrontendRoutes } from '@/constants/frontendRoutes/adminFrontendRoutes';
import { UserRole } from '@/constants/types/User';

export const adminRoutes: RouteObject[] = [
  {
    path: adminFrontendRoutes.dashboard,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <AdminDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.users,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <UserManagement />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.psychologists,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <PsychologistManagement />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.kyc,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <KycManagement />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.kycDetailsPath,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <KycVerificationPage />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.services,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <ServicePage />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.sessions,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <ConsultationManagement />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.plans,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <PlanPage />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.pendingPayouts,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <PendingPayoutPage />
      </PrivateRoute>
    ),
  },
  {
    path: adminFrontendRoutes.payoutHistory,
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <PayoutHistoryPage />
      </PrivateRoute>
    ),
  },
];
