import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';

const PublicRoute = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const { accessToken, role } = auth;
  console.log('🧪 PUBLIC ROUTE HIT', { accessToken, role });

  if (accessToken && role) {
    // Redirect to the appropriate dashboard based on role
    switch (role) {
      case 'user':
        return <Navigate to="/" replace />;
      case 'psychologist':
        return <Navigate to="/psychologist/profile" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
