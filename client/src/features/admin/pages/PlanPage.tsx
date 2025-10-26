import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import CreatePlanForm from '../components/CreatePlanForm';
import PlanTable from '../components/PlanTable';

const PlanPage = () => {
  return (
    <div className="flex h-screen w-full bg-admin-bg-secondary text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <CreatePlanForm />
        <PlanTable />
      </div>
    </div>
  );
};

export default PlanPage;
