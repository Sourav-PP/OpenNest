import Header from '@/components/user/Header.tsx';
import Sidebar from '@/components/user/Sidebar.tsx';
import UserSubscription from '../components/userSubscription';

const SubscriptionPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <UserSubscription />
      </div>
    </div>
  );
};

export default SubscriptionPage;
