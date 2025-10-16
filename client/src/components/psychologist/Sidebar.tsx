import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import {
  MessageCircle,
  User,
  Key,
  Calendar,
  // CreditCard,
  Clock,
  FileText,
  DollarSign,
  UserCheck,
  History,
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: 'My Profile',
      path: '/psychologist/profile',
      icon: <User width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
    {
      name: 'KYC Document',
      path: '/psychologist/kyc',
      icon: <UserCheck width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
    {
      name: 'Change password',
      path: '/psychologist/change-password',
      icon: <Key width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
    {
      name: 'My Slots',
      path: '/psychologist/slot',
      icon: <Calendar width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
    // {
    //   name: 'Subscriptions',
    //   path: '/psychologist/subscriptions',
    //   icon: <CreditCard width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    // },
    {
      name: 'My Consultations',
      path: '/psychologist/consultations',
      icon: <Clock width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
    {
      name: 'Session History',
      path: '/psychologist/consultation/history',
      icon: <History width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
    {
      name: 'My Chats',
      path: '/psychologist/chat',
      icon: <MessageCircle width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
    {
      name: 'My Reviews',
      path: '/psychologist/reviews',
      icon: <FileText width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
    {
      name: 'My Earnings',
      path: '/psychologist/dashboard',
      icon: <DollarSign width="20" height="20" stroke="#858585" strokeWidth="1.75" />,
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 px-3 bg-gray-800 text-white rounded-md"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen bg-white text-gray-700 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 p-6 flex flex-col gap-4 z-50 shadow-lg`}
      >
        {/* Logo */}
        <NavLink to={'/admin/dashboard'}>
          <div className="flex items-center gap-3 mb-6 cursor-pointer">
            <img src={assets.logo} alt="OpenNest Logo" className="w-[160px]" />
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-400 text-gray-800'
                    : 'text-gray-700 bg-gray-200 hover:bg-[#d0d3d4] hover:text-gray-800'
                }`
              }
              onClick={() => setIsOpen(false)} // Close sidebar on mobile click
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={toggleSidebar} />}
    </>
  );
};

export default Sidebar;
