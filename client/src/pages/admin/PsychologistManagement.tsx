import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
// import PsychologistTable from '../../components/admin/PsychologistTable';
import PsychologistTable from '@/components/admin/tables/PsychologistTable';

const PsychologistManagement = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <PsychologistTable/>
      </div>
    </div>
  );
};

export default PsychologistManagement;