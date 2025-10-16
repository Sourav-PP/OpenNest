import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
// import KycTable from '@/components/admin/KycTable';
import KycTable from '@/features/admin/components/KycTable';

const KycManagement = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <KycTable />
      </div>
    </div>
  );
};

export default KycManagement;
