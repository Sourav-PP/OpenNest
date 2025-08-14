import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import TopPsychologistTable from '../../components/admin/TopPsychologistTable';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <TopPsychologistTable/>
      </div>
    </div>
  );
};

export default AdminDashboard;