import { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { FiMenu, FiX } from 'react-icons/fi';
import BellButton from '../../features/user/components/BellButton';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { type RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { authApi } from '../../services/api/auth';
import { handleApiError } from '@/lib/utils/handleApiError';

const Navbar = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login', { state: { role: 'user' } });
  };

  const handleLogout = async () => {
    try {
      const res = await authApi.logout();
      dispatch(logout());
      localStorage.removeItem('persist:root');
      toast.success(res.message);
      navigate('/');
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div className="px-7 py-4 w-full sm:px-24 sm:py-6 fixed z-50">
      <nav className="relative flex justify-between items-center px-3 py-2 sm:px-2 sm:py-2 bg-white shadow-md border-[3px] border-[#3EB1EB] rounded-full">
        {/* Logo */}
        <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className="w-20 sm:w-28 ms-2 cursor-pointer" />

        {/* Desktop Menu */}
        <ul className="sm:ms-14 hidden md:flex gap-8 text-gray-700 font-medium">
          <li
            onClick={() => navigate('/')}
            className="cursor-pointer font-semibold transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]"
          >
            Home
          </li>
          <li
            onClick={() => navigate('/user/services')}
            className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]"
          >
            Services
          </li>
          <li
            onClick={() => navigate('/user/therapist')}
            className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]"
          >
            Therapists
          </li>
          <li className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]">
            About
          </li>
          <li className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-[#3bcca5]">
            Contact
          </li>
        </ul>

        {/* Right Section (Bell + Login/Dropdown + Menu) */}
        <div className="flex items-center gap-3">
          {/* Bell always visible */}
          {accessToken && <BellButton />}

          {/* Login or User Dropdown for md+ */}
          {accessToken ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={handleMouseEnter}
                className="flex items-center gap-2 text-white font-medium bg-gradient-to-r from-[#3EB1EB] to-[#2A9CDB] px-5 py-2.5 rounded-full hover:from-[#2A9CDB] hover:to-[#1B87C9] transition-all duration-300 hover:scale-105"
              >
                <span>User</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-300 ease-in-out transform ${
                  dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Arrow for dropdown */}
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                <div className="pt-2 pb-1 bg-gradient-to-b from-gray-50 to-white rounded-xl">
                  <button
                    onClick={() => navigate('/user/profile')}
                    className="block w-full text-left px-5 py-3 text-gray-700 font-medium text-base hover:bg-[#3EB1EB] hover:text-white transition-all duration-200 hover:scale-100 hover:rounded-lg transform origin-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-3 text-red-500 font-medium text-base hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-100 hover:rounded-lg transform origin-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block group text-center">
              <button
                onClick={handleLogin}
                className="text-white font-medium bg-gradient-to-r from-[#3EB1EB] to-[#2A9CDB] px-5 py-2.5 rounded-full hover:from-[#2A9CDB] hover:to-[#1B87C9] transition-all duration-300 group-hover:animate-glow-ring"
              >
                Login/Register
              </button>
            </div>
          )}

          {/* Mobile Toggle Button */}
          <div className="md:hidden text-2xl text-[#3EB1EB]">
            <button onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FiX /> : <FiMenu />}</button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`absolute top-full right-0 bg-white shadow-lg rounded-lg mt-2 p-6 flex flex-col gap-6 md:hidden transition-all duration-300 ease-in-out transform origin-top ${
            menuOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer font-semibold text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200"
          >
            Home
          </button>
          <button className="cursor-pointer text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200">
            Services
          </button>
          <button
            onClick={() => navigate('/user/therapist')}
            className="cursor-pointer text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200"
          >
            Therapists
          </button>
          <button className="cursor-pointer text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200">
            Blog
          </button>
          <button className="cursor-pointer text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200">
            Contact
          </button>
          {accessToken ? (
            <>
              <button
                onClick={() => navigate('/user/profile')}
                className="text-end text-gray-800 hover:text-[#3EB1EB] transition-colors duration-200"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-end text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="btn-login w-[10rem] px-6 py-2 rounded-md text-white bg-[#3EB1EB] hover:bg-[#2A9CDB] transition-colors duration-200"
            >
              Login/Register
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
