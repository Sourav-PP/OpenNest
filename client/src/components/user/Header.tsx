import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../redux/store';
import { handleApiError } from '@/lib/utils/handleApiError';
import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { User } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { email, profileImage } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      navigate(publicFrontendRoutes.logout, { replace: true });
    } catch (err) {
      handleApiError(err);
    }
  };

  const initials = email ? email.slice(0, 2).toUpperCase() : '??';

  return (
    <header className="w-full bg-white shadow-md z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Left: Logo / Title (currently empty, ready for future use) */}
        <div className="flex-shrink-0">
          <div className="text-xl font-bold text-gray-800">
            {/* Optional: <span>Admin Panel</span> */}
          </div>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Email + Initials (Hidden on very small screens, shown as tooltip alternative) */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
            <User className="w-4 h-4 text-admin-gb-box-active" />
            <span className="text-admin-gb-box-active text-sm font-medium truncate max-w-[120px] sm:max-w-[180px]">
              {email}
            </span>
          </div>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {profileImage ? (
              <img
                src={getCloudinaryUrl(profileImage) || undefined}
                alt="Profile"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-500 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => navigate('/profile')} // Optional: navigate to profile
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm border border-blue-400 hover:scale-105 transition-transform duration-200 cursor-pointer">
                {initials}
              </div>
            )}
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          {/* Logout Button */}
          <div className="group text-center">
            <button onClick={handleLogout} className="btn-logout flex rounded-full group-hover:animate-glow-ring">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;