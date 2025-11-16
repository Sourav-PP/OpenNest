import { useNavigate } from 'react-router-dom';
import { handleApiError } from '@/lib/utils/handleApiError';
import BellButton from '@/features/user/components/BellButton';
import { publicFrontendRoutes } from '@/constants/frontendRoutes/publicFrontendRoutes';
import { useEffect, useState } from 'react';
import type { IPsychologistProfileDto } from '@/types/dtos/psychologist';
import { psychologistApi } from '@/services/api/psychologist';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
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

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md z-40">
      {/* Left side (could add a logo or app name) */}
      <div className="text-xl font-semibold text-gray-800"></div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Email */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
          <User className="w-4 h-4 text-admin-gb-box-active" />
          <span className="text-admin-gb-box-active text-sm font-medium truncate max-w-[120px] sm:max-w-[180px]">
            {email}
          </span>
        </div>

        {/* Avatar */}
        {profileImage ? (
          <div className="relative">
            <img
              src={getCloudinaryUrl(profileImage) || undefined}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-sm hover:scale-105 transition-transform duration-200"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
        ) : (
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm border border-blue-400 hover:scale-105 transition-transform duration-200">
            {email?.slice(0, 2).toUpperCase()}
          </div>
        )}

        {/* Notification Bell */}
        <BellButton />

        {/* Logout */}
        <div className="group text-center">
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 px-5 py-2 rounded-full text-white hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
