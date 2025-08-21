import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';
import { authApi } from '@/services/api/auth';
import { handleApiError } from '@/lib/utils/handleApiError';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const res = await authApi.logout();
        toast.success(res.message);
      } catch (err) {
        handleApiError(err);
      } finally {
        dispatch(logout());
        localStorage.removeItem('persist:root');
        navigate('/', { replace: true });
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return null;
};

export default LogoutPage;
