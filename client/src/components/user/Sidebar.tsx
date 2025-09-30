import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Stethoscope, MessageSquare, Wallet, Lock, History } from 'lucide-react';
import { assets } from '../../assets/assets';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'My Profile', path: '/user/profile', icon: <Home className="w-5 h-5" /> },
    { name: 'Change Password', path: '/user/change-password', icon: <Lock className="w-5 h-5" /> },
    { name: 'My Sessions', path: '/user/consultations', icon: <Stethoscope className="w-5 h-5" /> },
    { name: 'Session History', path: '/user/consultation/history', icon: <History className='w-5 h-5' /> },
    { name: 'My Chats', path: '/user/chat', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Wallet', path: '/user/wallet', icon: <Wallet className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-slate-600 to-slate-400 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen bg-gradient-to-b from-slate-50 to-white text-gray-800 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 p-6 flex flex-col gap-6 shadow-md border-r-2 border-slate-200 z-50`}
      >
        {/* Logo */}
        <NavLink to={'/admin/dashboard'} className="mb-8">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={assets.logo} alt="OpenNest Logo" className="w-40 transition-transform duration-300 hover:scale-105" />
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? 'bg-slate-400 text-white shadow-md'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-300 hover:text-gray-900'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;