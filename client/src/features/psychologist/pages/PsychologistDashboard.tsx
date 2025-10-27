import Sidebar from '@/components/psychologist/Sidebar';
import Header from '@/components/psychologist/Header';
import PsychologistDashboardRevenueGraph from '../components/PsychologistDashboardRevenueGraph';
import TopUsersTable from '../components/TopUsersTable';
import TopRatedConsultationsTable from '../components/TopRatedConsultationsTable';
import PsychologistDashboardBookingTrendGraph from '../components/PsychologistDashboardBookingTrendGraph';
import PsychologistDashboardClientTrendGraph from '../components/PsychologistDashboardClientTrendGraph';

const PsychologistDashboard = () => {
  return (
    <div className="flex h-screen w-full bg-[#ECF1F3] text-primaryText overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <PsychologistDashboardRevenueGraph />
        <PsychologistDashboardBookingTrendGraph />
        <PsychologistDashboardClientTrendGraph />
        <TopUsersTable />
        <TopRatedConsultationsTable />
      </div>
    </div>
  );
};

export default PsychologistDashboard;
