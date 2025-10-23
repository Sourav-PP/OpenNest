import Sidebar from '@/components/psychologist/Sidebar';
import Header from '@/components/psychologist/Header';
import PsychologistDashboardCards from '../components/PsychologistDashboardCards';
import PayoutHistoryTable from '../components/PayoutHistoryTable';

const PsychologistEarningPage = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <PsychologistDashboardCards />
        <PayoutHistoryTable />
      </div>
    </div>
  );
};

export default PsychologistEarningPage;
