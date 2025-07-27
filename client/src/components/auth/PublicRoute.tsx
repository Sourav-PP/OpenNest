import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import { useEffect, useState, type ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({children}: PublicRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const { accessToken, role, isSubmittedVerification } = auth;
  const location = useLocation()

  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  const authPages = ['/login', '/signup', '/admin/login']
  console.log('🧪 PUBLIC ROUTE HIT', { accessToken, role });

  if (ready && accessToken && role && authPages.includes(location.pathname)) {
    switch (role) {
      case 'user':
        return <Navigate to="/" replace />;
      case 'psychologist':
        return isSubmittedVerification ? <Navigate to="/psychologist/profile" replace /> : <Navigate to={"/psychologist/verification" } replace />
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>
};

export default PublicRoute;
