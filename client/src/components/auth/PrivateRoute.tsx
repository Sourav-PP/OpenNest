import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import type { ReactNode } from 'react';
import { UserRole, type UserRoleType } from '@/constants/types/User';
import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';

interface Props {
  allowedRoles: UserRoleType[];
  children: ReactNode;
}

const PrivateRoute = ({ allowedRoles, children }: Props) => {
  const { accessToken, role } = useSelector((state: RootState) => state.auth);

  const location = useLocation();

  if (!accessToken || !role) {
    const path = location.pathname;

    let redirect: '/login' | '/admin/login' = publicFrontendRoutes.login;
    let redirectRole: UserRoleType = UserRole.USER;
    if (path.includes('/admin')) {
      redirect = publicFrontendRoutes.adminLogin;
    } else if (path.includes('/psychologist')) {
      redirectRole = UserRole.PSYCHOLOGIST;
    }

    return <Navigate to={redirect} state={{ from: location, role: redirectRole }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    let loginRedirect: '/login' | '/admin/login' = publicFrontendRoutes.login;
    let redirectRole: UserRoleType = UserRole.USER;

    if (role === UserRole.ADMIN) {
      loginRedirect = publicFrontendRoutes.adminLogin;
    } else if (role === UserRole.PSYCHOLOGIST) {
      redirectRole = UserRole.PSYCHOLOGIST;
    }

    return <Navigate to={loginRedirect} state={{ from: location, role: redirectRole }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
