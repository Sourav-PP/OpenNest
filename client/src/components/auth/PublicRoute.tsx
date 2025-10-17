import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import { useEffect, useState, type ReactNode } from 'react';
import { UserRole } from '@/constants/types/User';
import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';
import { psychologistFrontendRoutes } from '@/constants/frontendRoutes/psychologistFrontendRoutes';
import { adminFrontendRoutes } from '@/constants/frontendRoutes/adminFrontendRoutes';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const { accessToken, role, isSubmittedVerification } = auth;
  const location = useLocation();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const authPages = [publicFrontendRoutes.login, publicFrontendRoutes.signup, publicFrontendRoutes.adminLogin];
  type AuthPagePath = (typeof authPages)[number];

  function isAuthPagePath(path: string): path is AuthPagePath {
    return authPages.includes(path as AuthPagePath);
  }

  if (ready && accessToken && role && isAuthPagePath(location.pathname)) {
    switch (role) {
    case UserRole.USER:
      return <Navigate to={publicFrontendRoutes.landing} replace />;
    case UserRole.PSYCHOLOGIST:
      return isSubmittedVerification ? (
        <Navigate to={psychologistFrontendRoutes.profile} replace />
      ) : (
        <Navigate to={psychologistFrontendRoutes.verification} replace />
      );
    case UserRole.ADMIN:
      return <Navigate to={adminFrontendRoutes.dashboard} replace />;
    default:
      return <Navigate to={publicFrontendRoutes.landing} replace />;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
