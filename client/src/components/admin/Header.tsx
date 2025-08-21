import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api/admin';
import { handleApiError } from '@/lib/utils/handleApiError';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async() => {
    try {
      await adminApi.logout();

      dispatch(logout());
      localStorage.removeItem('persist:root');
      toast.success('Logout successfully');

      navigate('/admin/login');
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 text-white">
      <div></div>
      <button
        onClick={handleLogout}
        className="btn-logout flex rounded-full">
            Logout
      </button>
    </div>
  );
};

export default Header;