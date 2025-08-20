import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import type { ReactNode } from 'react';

interface Props {
    allowedRoles: ('user' | 'psychologist' | 'admin')[]
    children: ReactNode
}

const PrivateRoute = ({allowedRoles, children}: Props) => {
  const { accessToken, role } = useSelector((state: RootState) => state.auth);

  const location = useLocation();  

  if(!accessToken || !role) {
    const path = location.pathname;

    let redirect = '/login';
    let redirectRole: 'user' | 'psychologist' = 'user';
    if(path.includes('/admin')) {
      redirect = '/admin/login';
    } else if( path.includes('/psychologist')) {
      redirectRole = 'psychologist';
    }

    return (
      <Navigate
        to={redirect}
        state={{from: location, role: redirectRole}}
        replace
      />
    );
  }

  if (!allowedRoles.includes(role)) {
    let loginRedirect = '/login';
    let redirectRole: 'user' | 'psychologist' = 'user';

    if (role === 'admin') {
      loginRedirect = '/admin/login';
    } 
    else if (role === 'psychologist') {
      redirectRole = 'psychologist';
    } 

    return (
      <Navigate
        to={loginRedirect}
        state={{ from: location, role: redirectRole }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;