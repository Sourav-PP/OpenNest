import Header from '@/components/user/Header.tsx';
import Sidebar from '@/components/user/Sidebar.tsx';
import UserPlans from '../components/UserPlans';


const PlansPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <UserPlans />
      </div>
    </div>
  );
};

export default PlansPage;
