import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import CreatePlanForm from '../components/CreatePlanForm';

const PlanPage = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header/>
        <CreatePlanForm/>
      </div>
    </div>
  );
};

export default PlanPage;
