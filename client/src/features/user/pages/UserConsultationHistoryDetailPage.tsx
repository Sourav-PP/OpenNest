import Sidebar from '@/components/user/Sidebar';
import Header from '@/components/user/Header';
import UserConsultationHistoryDetail from '../components/UserConsultationHistoryDetail';

const UserConsultationHistoryDetailPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <UserConsultationHistoryDetail />
      </div>
    </div>
  );
};

export default UserConsultationHistoryDetailPage;

