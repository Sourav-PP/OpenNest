import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import ConsultationTable from '../components/ConsultationTable';

const ConsultationManagement = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <ConsultationTable/>
      </div>
    </div>
  );
};

export default ConsultationManagement;