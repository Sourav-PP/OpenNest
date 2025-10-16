import Header from '@/components/user/Header.tsx';
import Sidebar from '@/components/user/Sidebar.tsx';
import ChangePassword from '../components/ChangePassword';

const ChangePasswordPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <ChangePassword />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
