import Sidebar from '@/components/user/Sidebar';
import Header from '@/components/user/Header';
import UserConsultationHistoryTable from '../components/UserConsultationHistoryTable';

const UserConsultationHistoryPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <UserConsultationHistoryTable />
      </div>
    </div>
  );
};

export default UserConsultationHistoryPage;
