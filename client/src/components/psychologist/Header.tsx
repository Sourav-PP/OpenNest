import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import { handleApiError } from '@/lib/utils/handleApiError';
import BellButton from '@/features/user/components/BellButton';

const Header = () => {
  const navigate = useNavigate();
  const { email } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      navigate('/logout', { replace: true });
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md z-40">
      {/* Left side (could add a logo or app name) */}
      <div className="text-xl font-semibold text-gray-800"></div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Email */}
        <p className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">{email}</p>

        {/* Avatar */}
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {email?.slice(0, 2).toUpperCase()}
        </div>

        {/* Notification Bell */}
        <BellButton />

        {/* Logout */}
        <div className="group text-center">
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
