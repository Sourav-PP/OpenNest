import Sidebar from '@/components/user/Sidebar';
import Header from '@/components/user/Header';
// import UserConsultationsTable from '@/components/user/UserConsultationsTable';
import UserConsultationsTable from '@/components/user/tables/userConsultationsTable';

const MySessionsPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <UserConsultationsTable />
      </div>
    </div>
  );
};

export default MySessionsPage;
