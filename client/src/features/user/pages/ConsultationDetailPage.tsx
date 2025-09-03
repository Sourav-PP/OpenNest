import Sidebar from '@/components/user/Sidebar';
import Header from '@/components/user/Header';
import UserConsultationsDetail from '../components/UserConsultationsDetail';

const ConsultationDetailPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <UserConsultationsDetail />
      </div>
    </div>
  );
};

export default ConsultationDetailPage;

